<template>
  <div class="about-page">
    <div class="container">

      <section class="about-hero">
        <div class="about-hero-content">
          <h1>{{ about.heroTitle }}</h1>
          <h2>{{ about.heroSubtitle }}</h2>
          <p class="about-lead">{{ about.heroLead }}</p>
          <button class="btn" @click="openFeedback">Связаться с нами</button>
        </div>
      </section>

      <section class="about-section">
        <h3>{{ about.productionTitle }}</h3>
        <p>{{ about.productionText }}</p>
      </section>

      <section class="about-advantages">
        <h4>{{ about.advantagesTitle }}</h4>
        <ul class="advantages-list">
          <li v-for="(adv, i) in about.advantages" :key="i">
            <span class="adv-icon">{{ ['🏭','✅','🔍','🧵','🖨️','📅','🚚'][i] || '✓' }}</span>
            <span>{{ adv }}</span>
          </li>
        </ul>
      </section>

      <section class="about-section about-quality">
        <h5>{{ about.qualityTitle }}</h5>
        <p>{{ about.qualityText }}</p>
      </section>

      <section class="about-section about-partnership">
        <h6>{{ about.partnershipTitle }}</h6>
        <p>{{ about.partnershipText }}</p>
        <button class="btn btn-outline" @click="openFeedback">Оставить заявку</button>
      </section>

    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
import contentData from '../data/content.json'

export default {
  name: 'AboutPage',
  setup() {
    const openFeedbackModal = inject('openFeedbackModal')
    return { openFeedbackModal }
  },
  data() {
    return {
      about: contentData.about
    }
  },
  methods: {
    openFeedback() {
      this.openFeedbackModal()
    }
  }
}
</script>

<style scoped>
.about-page {
  padding: 48px 0 90px;
}

/* Hero: text only */
.about-hero {
  margin-bottom: 64px;
  background: linear-gradient(180deg, rgba(114, 47, 55, 0.05), rgba(114, 47, 55, 0.01));
  border-radius: 20px;
  padding: 48px 56px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
}

.about-hero-content h1 {
  font-size: 38px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-dark);
  margin-bottom: 14px;
}

.about-hero-content h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 18px;
  line-height: 1.3;
}

.about-lead {
  font-size: 17px;
  color: var(--text-light);
  line-height: 1.65;
  margin-bottom: 28px;
}

/* Generic content sections */
.about-section {
  max-width: 820px;
  margin: 0 auto 52px;
}

.about-section h3 {
  font-size: 30px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

.about-section p {
  font-size: 18px;
  color: var(--text-light);
  line-height: 1.65;
}

/* Advantages */
.about-advantages {
  background: white;
  border-radius: 18px;
  padding: 40px 48px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
  margin-bottom: 52px;
}

.about-advantages h4 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 24px;
}

.advantages-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.advantages-list li {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 17px;
  color: var(--text-dark);
  background: rgba(114, 47, 55, 0.04);
  border-radius: 12px;
  padding: 14px 18px;
  border: 1px solid rgba(114, 47, 55, 0.08);
}

.adv-icon {
  font-size: 22px;
  flex-shrink: 0;
}

/* Quality section */
.about-quality {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  border-radius: 18px;
  padding: 40px 48px;
  color: white;
  max-width: 100%;
}

.about-quality h5 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 14px;
  color: white;
}

.about-quality p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.65;
}

/* Partnership section */
.about-partnership {
  background: white;
  border-radius: 18px;
  padding: 40px 48px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
  max-width: 100%;
}

.about-partnership h6 {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 14px;
}

.about-partnership p {
  font-size: 17px;
  color: var(--text-light);
  line-height: 1.65;
  margin-bottom: 24px;
}

.btn-outline {
  background: transparent !important;
  border: 2px solid var(--primary-color) !important;
  color: var(--primary-color) !important;
}

.btn-outline:hover {
  background: var(--primary-color) !important;
  color: white !important;
}

@media (max-width: 900px) {
  .about-hero {
    padding: 28px 24px;
  }

  .about-hero-content h1 {
    font-size: 28px;
  }

  .about-hero-content h2 {
    font-size: 17px;
  }

  .about-advantages,
  .about-quality,
  .about-partnership {
    padding: 28px 24px;
  }

  .about-advantages h4 {
    font-size: 22px;
  }

  .about-quality h5 {
    font-size: 20px;
  }

  .about-partnership h6 {
    font-size: 19px;
  }
}

@media (max-width: 480px) {
  .about-page {
    padding: 24px 0 60px;
  }

  .about-hero {
    padding: 20px 16px;
    margin-bottom: 36px;
    border-radius: 12px;
  }

  .about-hero-content h1 {
    font-size: 22px;
  }

  .about-hero-content h2 {
    font-size: 15px;
  }

  .about-lead {
    font-size: 15px;
  }

  .about-section h3 {
    font-size: 22px;
  }

  .about-section p,
  .about-quality p,
  .about-partnership p {
    font-size: 15px;
  }

  .about-advantages,
  .about-quality,
  .about-partnership {
    padding: 20px 16px;
    border-radius: 12px;
  }

  .advantages-list li {
    font-size: 15px;
  }
}
</style>
