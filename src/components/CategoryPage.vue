<template>
  <div class="category-page">
    <div class="container">
      <h1 class="page-title">{{ getCategoryTitle() }}</h1>

      <!-- Jackets features — under the title -->
      <section v-if="type === 'jackets'" class="jackets-info jackets-info--top">
        <div class="jackets-features">
          <div class="jf-item">
            <span class="jf-icon">🏷️</span>
            <span>Брендирование изделий</span>
          </div>
          <div class="jf-item">
            <span class="jf-icon">🧵</span>
            <span>Подбор материалов и фурнитуры</span>
          </div>
        </div>
      </section>
      
      <div class="products-grid">
        <div 
          v-for="(product, index) in products" 
          :key="product.id"
          class="product-card"
        >
          <div class="product-header">
            <ProductGallery :images="product.images" :priority="index === 0" />
          </div>
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-price">от {{ product.price }} ₽</div>
          </div>
        </div>
      </div>

      <!-- Uniform / Юнармия section -->
      <section v-if="type === 'uniform'" class="uniform-info">
        <p class="uniform-intro">
          Осуществляем выпуск формы для движения Юнармия с соблюдением требований к качеству,
          внешнему виду и единым стандартам.
        </p>

        <div class="uniform-columns">
          <div class="uniform-col">
            <h3>Ассортимент продукции</h3>
            <ul class="uniform-list">
              <li>Трикотажные футболки</li>
              <li>Футболки-поло всех моделей</li>
              <li>Свитшоты</li>
              <li>Флисовая толстовка</li>
              <li>Погоны и шевроны</li>
            </ul>
          </div>

          <div class="uniform-col">
            <h3>Преимущества нашего производства</h3>
            <ul class="uniform-list">
              <li>Лицензионный договор с Юнармией</li>
              <li>Честный знак</li>
              <li>Опыт работы с официальной продукцией</li>
              <li>Вышивка и печать</li>
              <li>Работа с собственным и давальческим сырьём</li>
              <li>ОТК контроль</li>
            </ul>
          </div>
        </div>

        <div class="uniform-cta">
          <h3>Производство продукции Юнармия под ключ</h3>
          <p>Мы берём на себя все этапы производства и обеспечиваем стабильный результат.</p>
        </div>
      </section>


    </div>
  </div>
</template>

<script>
import ProductGallery from './ProductGallery.vue'
import { fileSystemManager } from '../utils/fileSystemManager.js'
import productsData from '../data/products.json'

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
        polo: 'Производство футболок поло любой сложности',
        uniform: 'Форменная одежда',
        hoodies: 'Ассортимент трикотажного производства',
        shoppers: 'Промо текстиль',
        jackets: 'Производство корпоративной одежды и униформы'
      }
      return titles[this.type] || 'Каталог'
    },

    loadProducts(type) {
      try {
        const categoryProducts = (productsData[type] || []).map(product => ({
          ...product,
          images: fileSystemManager.getImagesFromDirectory(type, product.slug, product.imageOrder)
        }))
        this.products = categoryProducts
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error)
        this.products = []
      }
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
  grid-template-columns: 1fr;
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

@media (max-width: 768px) {
  .category-page {
    padding: 28px 0;
  }

  .products-grid {
    gap: 20px;
  }

  .page-title {
    font-size: 32px;
    margin-bottom: 28px;
  }

  .product-info {
    padding: 18px;
  }

  .product-name {
    font-size: 24px;
  }

  .product-description {
    font-size: 15px;
  }

  .product-price {
    font-size: 24px;
  }

  .product-card:hover {
    transform: none;
  }
}

@media (max-width: 480px) {
  .category-page {
    padding: 20px 0;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .products-grid {
    gap: 16px;
  }

  .product-info {
    padding: 16px;
  }

  .product-name {
    font-size: 20px;
  }

  .product-description {
    font-size: 14px;
  }

  .product-price {
    font-size: 22px;
  }
}

/* === Uniform info === */
.uniform-info {
  margin-top: 56px;
  border-top: 2px solid rgba(114, 47, 55, 0.12);
  padding-top: 48px;
}

.uniform-intro {
  font-size: 19px;
  color: var(--text-light);
  line-height: 1.65;
  margin-bottom: 40px;
  max-width: 860px;
}

.uniform-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
}

.uniform-col {
  background: white;
  border-radius: 16px;
  padding: 30px 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
}

.uniform-col h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 18px;
}

.uniform-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.uniform-list li {
  font-size: 16px;
  color: var(--text-dark);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(114, 47, 55, 0.04);
  border-radius: 10px;
  border: 1px solid rgba(114, 47, 55, 0.07);
}

.uniform-list li::before {
  content: '✓';
  color: var(--primary-color);
  font-weight: 700;
  flex-shrink: 0;
}

.uniform-cta {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  border-radius: 16px;
  padding: 36px 40px;
  color: white;
}

.uniform-cta h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: white;
}

.uniform-cta p {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* === Jackets info === */
.jackets-info {
  margin-top: 48px;
}

.jackets-info--top {
  margin-top: 0;
  margin-bottom: 36px;
}

.jackets-features {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.jf-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-dark);
  background: white;
  border-radius: 12px;
  padding: 16px 22px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(114, 47, 55, 0.08);
}

.jf-icon {
  font-size: 22px;
}

@media (max-width: 768px) {
  .uniform-columns {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .uniform-col {
    padding: 20px;
  }

  .uniform-cta {
    padding: 24px 20px;
  }

  .uniform-cta h3 {
    font-size: 20px;
  }

  .uniform-intro {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .uniform-info {
    margin-top: 36px;
    padding-top: 28px;
  }

  .uniform-cta {
    border-radius: 12px;
  }

  .jf-item {
    font-size: 15px;
  }
}
</style>
