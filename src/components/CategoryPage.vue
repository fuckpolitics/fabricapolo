<template>
  <div class="category-page">
    <div class="container">
      <h1 class="page-title">{{ getCategoryTitle() }}</h1>
      
      <div class="products-grid">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="product-card"
        >
          <div class="product-header">
            <ProductGallery :images="product.images" />
          </div>
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-price">от {{ product.price }} ₽</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductGallery from './ProductGallery.vue'
import { fileSystemManager } from '../utils/fileSystemManager.js'

export default {
  name: 'CategoryPage',
  components: {
    ProductGallery
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      products: []
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(newType) {
        this.loadProducts(newType)
      }
    }
  },
  methods: {
    getCategoryTitle() {
      const titles = {
        polo: 'Футболки поло',
        uniform: 'Форменная одежда',
        hoodies: 'Трикотаж',
        shoppers: 'Промо текстиль',
        jackets: 'Жилетки/куртки/ветровки'
      }
      return titles[this.type] || 'Каталог'
    },
    
    async loadProducts(type) {
      try {
        // Базовые данные о товарах
        const productsData = this.getProductsData(type)
        
        // Загружаем изображения для каждого товара из файловой системы
        for (const product of productsData) {
          product.images = fileSystemManager.getImagesFromDirectory(type, product.slug)
        }
        
        this.products = productsData
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error)
        this.products = []
      }
    },
    
    getProductsData(type) {
      // Базовые данные о товарах (без изображений)
      const allProducts = {
        polo: [
          {
            id: 1,
            slug: 'female-polo',
            name: 'Футболка поло женская',
            description: 'Идеально подходит для корпоративного стиля',
            price: 2500
          },
          {
            id: 2,
            slug: 'male-polo',
            name: 'Футболка поло мужская',
            description: 'Дышащая ткань для активного образа жизни',
            price: 2800
          },
          {
            id: 3,
            slug: 'polo-details',
            name: 'Футболка поло детали',
            description: 'Премиум качество для особых случаев',
            price: 3200
          },
          {
            id: 4,
            slug: 'basic-tshirt',
            name: 'Футболка',
            description: 'Удобный вариант для повседневной носки',
            price: 2000
          }
        ],
        uniform: [
          {
            id: 5,
            slug: 'unarmy',
            name: 'Юнармия',
            description: 'Профессиональная форма для юнармии',
            price: 4500
          },
          {
            id: 6,
            slug: 'unarmy-hoodies',
            name: 'Юнармия. Толстовки',
            description: 'Уютные толстовки для юнармии',
            price: 3800
          },
          {
            id: 7,
            slug: 'ems',
            name: 'МЧС',
            description: 'Профессиональная форма МЧС',
            price: 5500
          }
        ],
        hoodies: [
          {
            id: 8,
            slug: 'sweatshirts',
            name: 'Толстовки',
            description: 'Уютное тепло для холодных дней',
            price: 3500
          },
          {
            id: 9,
            slug: 'hoodie',
            name: 'Худи',
            description: 'Для тренировок и активного отдыха',
            price: 3800
          },
          {
            id: 10,
            slug: 'sweaters',
            name: 'Свитшоты',
            description: 'Стильные свитшоты для повседневной носки',
            price: 3200
          },
          {
            id: 11,
            slug: 'bomber',
            name: 'Бомберы',
            description: 'Современные бомберы для вашего стиля',
            price: 4500
          },
          {
            id: 12,
            slug: 'pants',
            name: 'Брюки',
            description: 'Комфортные брюки для повседневной носки',
            price: 2800
          }
        ],
        shoppers: [
          {
            id: 13,
            slug: 'promo-textile',
            name: 'Промо текстиль',
            description: 'Практичные промо-изделия с брендированием',
            price: 800
          }
        ],
        jackets: [
          {
            id: 14,
            slug: 'vests',
            name: 'Жилетки',
            description: 'Стильные и практичные жилетки',
            price: 4200
          },
          {
            id: 15,
            slug: 'coats',
            name: 'Куртки',
            description: 'Защита от ветра и легких осадков',
            price: 6500
          },
          {
            id: 16,
            slug: 'windbreaker',
            name: 'Ветровки',
            description: 'Легкие ветровки для демисезонного периода',
            price: 3200
          }
        ]
      }
      
      return allProducts[type] || []
    }
  }
}
</script>

<style scoped>
.category-page {
  padding: 40px 0;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 40px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px var(--shadow);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.product-header {
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-info {
  padding: 22px;
}

.product-name {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.product-description {
  font-size: 17px;
  color: var(--text-light);
  line-height: 1.5;
  margin-bottom: 15px;
}

.product-price {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .page-title {
    font-size: 32px;
  }
}
</style>
