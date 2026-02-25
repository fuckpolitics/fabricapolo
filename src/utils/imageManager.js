// Утилита для управления изображениями в проекте

export class ImageManager {
  constructor() {
    this.dataFile = '/src/data/products.json'
  }

  // Загрузить данные из JSON файла
  async loadProductsData() {
    try {
      const response = await fetch(this.dataFile)
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные продуктов')
      }
      return await response.json()
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      return null
    }
  }

  // Сохранить данные в JSON файл (эмуляция для разработки)
  async saveProductsData(data) {
    try {
      // В реальном приложении здесь был бы запрос на сервер
      // для сохранения файла в директорию проекта
      
      console.log('Сохранение данных в products.json:', data)
      
      // Эмуляция сохранения - создаем файл для скачивания
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'products.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      console.error('Ошибка сохранения данных:', error)
      return false
    }
  }

  // Обновить изображения для конкретного товара
  async updateProductImages(category, productId, newImages) {
    try {
      const data = await this.loadProductsData()
      if (!data) return false

      const categoryProducts = data[category]
      if (!categoryProducts) return false

      const product = categoryProducts.find(p => p.id === productId)
      if (!product) return false

      product.images = newImages
      
      // Сохраняем обновленные данные
      const success = await this.saveProductsData(data)
      
      if (success) {
        console.log(`Изображения для товара ${productId} в категории ${category} обновлены`)
      }
      
      return success
    } catch (error) {
      console.error('Ошибка обновления изображений:', error)
      return false
    }
  }

  // Получить продукты для категории
  async getProductsByCategory(category) {
    try {
      const data = await this.loadProductsData()
      return data ? data[category] || [] : []
    } catch (error) {
      console.error('Ошибка получения продуктов:', error)
      return []
    }
  }
}

// Глобальный экземпляр для использования в компонентах
export const imageManager = new ImageManager()
