// utils/githubApi.js
// Communicates with the GitHub Contents API and Git Data API.

const PRODUCTS_JSON_PATH = 'src/data/products.json'
const REVIEWS_JSON_PATH = 'src/data/reviews.json'

export class GitHubApi {
  constructor(token, owner, repo, branch = 'main') {
    this.token = token
    this.owner = owner
    this.repo = repo
    this.branch = branch
    this.base = `https://api.github.com/repos/${owner}/${repo}/contents`
    this.gitBase = `https://api.github.com/repos/${owner}/${repo}/git`
  }

  _headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    }
  }

  _toBase64(str) {
    const bytes = new TextEncoder().encode(str)
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return btoa(binary)
  }

  async getFileSha(path) {
    const bust = Date.now()
    const res = await fetch(`${this.base}/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${this.branch}&_=${bust}`, {
      headers: this._headers()
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    const data = await res.json()
    return data.sha
  }

  // Upload a new file (no SHA needed — file doesn't exist yet)
  async uploadNewFile(repoPath, fileBase64, message = 'CMS: upload image') {
    const body = {
      message,
      content: fileBase64,
      branch: this.branch
    }
    const res = await fetch(`${this.base}/${repoPath}`, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify(body)
    })
    // 422 = file already exists, fall back to update with SHA
    if (res.status === 422) {
      return this.uploadFile(repoPath, fileBase64, message)
    }
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    return res.json()
  }

  // Upload or update a single file (used for images)
  async uploadFile(repoPath, fileBase64, message = 'CMS: upload image') {
    const sha = await this.getFileSha(repoPath)
    const body = {
      message,
      content: fileBase64,
      branch: this.branch,
      ...(sha ? { sha } : {})
    }
    const res = await fetch(`${this.base}/${repoPath}`, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    return res.json()
  }

  async deleteFile(repoPath, message = 'CMS: delete image') {
    const sha = await this.getFileSha(repoPath)
    if (!sha) return
    const body = { message, sha, branch: this.branch }
    const res = await fetch(`${this.base}/${repoPath}`, {
      method: 'DELETE',
      headers: this._headers(),
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    return res.json()
  }

  // Commit multiple text files in a single Git commit via Trees API.
  // files: [{ path: 'src/...', content: '...' }, ...]
  async commitMultipleFiles(files, message, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      // 1. Get current branch tip SHA (fresh every attempt)
      const refRes = await fetch(`${this.gitBase}/ref/heads/${this.branch}`, {
        headers: this._headers()
      })
      if (!refRes.ok) throw new Error(`Git ref error ${refRes.status}: ${await refRes.text()}`)
      const refData = await refRes.json()
      const latestCommitSha = refData.object.sha

      // 2. Get the tree SHA of the latest commit
      const commitRes = await fetch(`${this.gitBase}/commits/${latestCommitSha}`, {
        headers: this._headers()
      })
      if (!commitRes.ok) throw new Error(`Git commit error ${commitRes.status}: ${await commitRes.text()}`)
      const commitData = await commitRes.json()
      const baseTreeSha = commitData.tree.sha

      // 3. Create a new tree with the updated files
      const tree = files.map(f => ({
        path: f.path,
        mode: '100644',
        type: 'blob',
        content: f.content
      }))
      const treeRes = await fetch(`${this.gitBase}/trees`, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify({ base_tree: baseTreeSha, tree })
      })
      if (!treeRes.ok) throw new Error(`Git tree error ${treeRes.status}: ${await treeRes.text()}`)
      const treeData = await treeRes.json()

      // 4. Create the commit
      const newCommitRes = await fetch(`${this.gitBase}/commits`, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify({
          message,
          tree: treeData.sha,
          parents: [latestCommitSha]
        })
      })
      if (!newCommitRes.ok) throw new Error(`Git commit create error ${newCommitRes.status}: ${await newCommitRes.text()}`)
      const newCommitData = await newCommitRes.json()

      // 5. Update the branch ref — retry on 422 (non-fast-forward race condition)
      const updateRefRes = await fetch(`${this.gitBase}/refs/heads/${this.branch}`, {
        method: 'PATCH',
        headers: this._headers(),
        body: JSON.stringify({ sha: newCommitData.sha })
      })

      if (updateRefRes.status === 422 && attempt < retries - 1) {
        // Another push happened between our read and write — retry with fresh HEAD
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }

      if (!updateRefRes.ok) throw new Error(`Git ref update error ${updateRefRes.status}: ${await updateRefRes.text()}`)
      return newCommitData
    }
  }

  async updateProductsAndReviews(productsObject, reviewsArray) {
    return this.commitMultipleFiles([
      {
        path: PRODUCTS_JSON_PATH,
        content: JSON.stringify(productsObject, null, 2)
      },
      {
        path: REVIEWS_JSON_PATH,
        content: JSON.stringify(reviewsArray, null, 2)
      }
    ], 'CMS: update products & reviews')
  }

  // Validate the token by fetching repo info
  async validateToken() {
    const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}`, {
      headers: this._headers()
    })
    return res.ok
  }
}

// Convert a File object to a base64 string (no data-URI prefix)
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      resolve(dataUrl.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
