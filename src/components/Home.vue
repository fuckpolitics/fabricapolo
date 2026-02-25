<template>
  <div class="home">
    <div class="container-wide">
      <section class="hero">
        <div class="hero-content">
          <h2>Корпоративная одежда под ваш бренд</h2>
          <p>
            Производим поло, форму, худи, футболки и аксессуары.
            Подберём ткань, нанесение и лекала под задачи компании.
          </p>
          <button class="btn" @click="goToCategory('polo')">Смотреть поло</button>
        </div>
      </section>

      <div class="category-banners">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-banner"
          :class="'banner-' + category.type"
          @click="goToCategory(category.type)"
        >
          <div class="banner-content">
            <h2>{{ category.name }}</h2>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </div>

      <section class="split">
        <div class="split-left">
          <ImageSlideshow :images="showcaseImages" alt="Производство" />
        </div>
        <div class="split-right">
          <h3>Стабильное производство и контроль качества</h3>
          <p>
            Работаем с корпоративными заказами: подбираем материалы, строим лекала,
            делаем нанесение (вышивка/шелкография/термотрансфер) и сопровождаем проект
            от образца до партии.
          </p>
          <div class="split-points">
            <div class="point">
              <div class="point-title">Сроки и повторяемость</div>
              <div class="point-text">Фиксируем параметры изделия и качество партии.</div>
            </div>
            <div class="point">
              <div class="point-title">Нанесение под бренд</div>
              <div class="point-text">Подберём оптимальную технологию под задачу.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="logos">
        <LogoCarousel :logos="clientLogos" />
      </section>
    </div>
  </div>
</template>

<script>
import ImageSlideshow from './ImageSlideshow.vue'
import LogoCarousel from './LogoCarousel.vue'

export default {
  name: 'Home',
  components: {
    ImageSlideshow,
    LogoCarousel
  },
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Футболки поло',
          type: 'polo',
          description: 'Классические и стильные поло для корпоративного стиля'
        },
        {
          id: 2,
          name: 'Форменная одежда',
          type: 'uniform',
          description: 'Профессиональная форма для сотрудников любой компании'
        },
        {
          id: 3,
          name: 'Трикотаж',
          type: 'hoodies',
          description: 'Уютная и стильная верхняя одежда для вашего бренда'
        },
        {
          id: 4,
          name: 'Жилетки/куртки/ветровки',
          type: 'jackets',
          description: 'Демисезонная одежда для корпоративного гардероба'
        },
        {
          id: 5,
          name: 'Промо текстиль',
          type: 'shoppers',
          description: 'Практичные сумки-шопперы с брендированием'
        }
      ],
      showcaseImages: [
        'https://picsum.photos/seed/fp-showcase-1/1200/900',
        'https://picsum.photos/seed/fp-showcase-2/1200/900',
        'https://picsum.photos/seed/fp-showcase-3/1200/900'
      ],
      clientLogos: [
        { name: 'Company A', src: 'https://dummyimage.com/320x140/ffffff/722f37.png&text=Company+A' },
        { name: 'Company B', src: 'https://dummyimage.com/320x140/ffffff/722f37.png&text=Company+B' },
        { name: 'Company C', src: 'https://dummyimage.com/320x140/ffffff/722f37.png&text=Company+C' },
        { name: 'Company D', src: 'https://dummyimage.com/320x140/ffffff/722f37.png&text=Company+D' },
        { name: 'Company E', src: 'https://dummyimage.com/320x140/ffffff/722f37.png&text=Company+E' },
        { name: 'Company F', src: 'https://dummyimage.com/320x140/ffffff/722f37.png&text=Company+F' }
      ]
    }
  },
  methods: {
    goToCategory(type) {
      this.$router.push(`/category/${type}`)
    }
  }
}
</script>

<style scoped>
.home {
  padding: 40px 0 90px;
}

.hero {
  position: relative;
  min-height: 520px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin: 10px 0 56px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(180deg, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.55)),
    url('https://picsum.photos/seed/fabrika-polo-hero/1400/700');
  background-size: cover;
  background-position: center;
  opacity: 0.95;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  padding: 72px;
  color: white;
}

.hero-content h2 {
  font-size: 54px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-content p {
  font-size: 20px;
  opacity: 0.95;
  margin-bottom: 26px;
}

.category-banners {
  display: grid;
  grid-template-columns: 1fr;
  gap: 34px;
  margin-top: 0;
}

.category-banner {
  position: relative;
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  box-shadow: 0 4px 15px var(--shadow);
}

.category-banner:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(114, 47, 55, 0.3);
}

.category-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.25;
  z-index: 0;
}

.banner-polo::before {
  background-image: url('https://picsum.photos/seed/polo-bg/1200/600');
}

.banner-uniform::before {
  background-image: url('https://picsum.photos/seed/uniform-bg/1200/600');
}

.banner-hoodies::before {
  background-image: url('https://picsum.photos/seed/hoodies-bg/1200/600');
}

.banner-tshirts::before {
  background-image: url('https://picsum.photos/seed/tshirts-bg/1200/600');
}

.banner-shoppers::before {
  background-image: url('https://picsum.photos/seed/shoppers-bg/1200/600');
}

.banner-jackets::before {
  background-image: url('https://picsum.photos/seed/jackets-bg/1200/600');
}

.banner-content {
  position: relative;
  z-index: 1;
  padding: 78px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.banner-content h2 {
  font-size: 46px;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-content p {
  font-size: 20px;
  line-height: 1.5;
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.split {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 34px;
  align-items: stretch;
  padding: 40px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(114, 47, 55, 0.06), rgba(114, 47, 55, 0.02));
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  margin: 0 0 70px;
}

.split-left {
  min-height: 520px;
}

.split-right h3 {
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 16px;
}

.split-right p {
  font-size: 18px;
  color: var(--text-light);
  margin-bottom: 22px;
}

.split-points {
  display: grid;
  gap: 14px;
}

.point {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: 16px 18px;
}

.point-title {
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 6px;
}

.point-text {
  font-size: 16px;
  color: var(--text-light);
}

.logos {
  margin: 0 0 10px;
}

@media (max-width: 768px) {
  .category-banners {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .hero {
    min-height: 320px;
    margin: 8px 0 40px;
  }

  .hero-content {
    padding: 34px;
  }

  .hero-content h2 {
    font-size: 34px;
  }

  .hero-content p {
    font-size: 16px;
  }
  
  .category-banner {
    height: 260px;
  }
  
  .banner-content {
    padding: 34px;
  }
  
  .banner-content h2 {
    font-size: 30px;
  }
  
  .banner-content p {
    font-size: 15px;
  }

  .split {
    grid-template-columns: 1fr;
    padding: 24px;
    margin: 0 0 50px;
  }

  .split-left {
    min-height: 320px;
  }

  .split-right h3 {
    font-size: 26px;
  }
}
</style>
