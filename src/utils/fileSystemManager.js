// utils/fileSystemManager.js

const images = import.meta.glob(
  '/src/img/products/**/**/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { query: '?url', import: 'default', eager: true }
)

export class FileSystemManager {
  basePath = '/src/img/products/'

  // Returns a map of filename → resolved URL for all images in a directory
  getImageMapForDirectory(category, productSlug) {
    const folder = `${this.basePath}${category}/${productSlug}/`
    const map = {}
    for (const [path, url] of Object.entries(images)) {
      if (path.startsWith(folder)) {
        const filename = path.slice(folder.length)
        map[filename] = url
      }
    }
    return map
  }

  // Returns resolved URLs respecting imageOrder (array of filenames).
  // If imageOrder is empty, returns all images in default sorted order.
  getImagesFromDirectory(category, productSlug, imageOrder = []) {
    const map = this.getImageMapForDirectory(category, productSlug)

    if (imageOrder && imageOrder.length > 0) {
      const ordered = []
      for (const filename of imageOrder) {
        if (map[filename]) ordered.push(map[filename])
      }
      // Append any files that exist on disk but are not in imageOrder yet
      for (const [filename, url] of Object.entries(map)) {
        if (!imageOrder.includes(filename)) ordered.push(url)
      }
      return ordered
    }

    return this.sortImageFiles(Object.values(map))
  }

  // Returns list of filenames (not URLs) available in a directory
  getFilenamesInDirectory(category, productSlug) {
    const folder = `${this.basePath}${category}/${productSlug}/`
    return Object.keys(images)
      .filter(path => path.startsWith(folder))
      .map(path => path.slice(folder.length))
  }

  sortImageFiles(files) {
    return files.sort((a, b) => {
      const aName = a.split('/').pop()
      const bName = b.split('/').pop()

      const aNum = this.extractNumericPrefix(aName)
      const bNum = this.extractNumericPrefix(bName)

      if (aNum !== null && bNum !== null) return aNum - bNum
      if (aNum !== null) return -1
      if (bNum !== null) return 1

      return aName.localeCompare(bName)
    })
  }

  extractNumericPrefix(filename) {
    const match = filename.match(/^(\d+)(?:\D|$)/)
    return match ? Number(match[1]) : null
  }
}

export const fileSystemManager = new FileSystemManager()
