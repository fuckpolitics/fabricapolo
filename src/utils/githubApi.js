// utils/githubApi.js
// Communicates with the GitHub Contents API to persist CMS changes.
// The token is provided by the user in the admin UI and never stored persistently.

const PRODUCTS_JSON_PATH = 'src/data/products.json'

export class GitHubApi {
  constructor(token, owner, repo, branch = 'main') {
    this.token = token
    this.owner = owner
    this.repo = repo
    this.branch = branch
    this.base = `https://api.github.com/repos/${owner}/${repo}/contents`
  }

  _headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    }
  }

  async getFileSha(path) {
    const res = await fetch(`${this.base}/${path}?ref=${this.branch}`, {
      headers: this._headers()
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    const data = await res.json()
    return data.sha
  }

  // Upload or update a file. fileBase64 is a raw base64 string (no data-URI prefix).
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
    if (!sha) return // already gone
    const body = { message, sha, branch: this.branch }
    const res = await fetch(`${this.base}/${repoPath}`, {
      method: 'DELETE',
      headers: this._headers(),
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    return res.json()
  }

  async updateProductsJson(productsObject) {
    const json = JSON.stringify(productsObject, null, 2)
    const base64 = btoa(unescape(encodeURIComponent(json)))
    return this.uploadFile(PRODUCTS_JSON_PATH, base64, 'CMS: update products.json')
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
