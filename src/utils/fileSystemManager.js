// utils/fileSystemManager.js

const images = import.meta.glob(
  '/src/img/products/**/**/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  {
    eager: true,
    as: 'url' // 🔥 ВАЖНО
  }
)

export class FileSystemManager {
  basePath = '/src/img/products/'

  getImagesFromDirectory(category, productSlug) {
    const folder = `${this.basePath}${category}/${productSlug}/`

    const files = Object.entries(images)
      .filter(([path]) => path.startsWith(folder))
      .map(([, url]) => url) // 🔥 теперь это РЕАЛЬНЫЕ URL

    return this.sortImageFiles(files)
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