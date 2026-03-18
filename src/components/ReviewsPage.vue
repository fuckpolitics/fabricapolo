<template>
  <div class="reviews-page">
    <div class="container">
      <h1 class="page-title">Отзывы</h1>
      <p class="page-desc">Что говорят о нас клиенты</p>

      <div class="reviews-list">
        <article
          v-for="review in reviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-header">
            <div class="review-stars" aria-label="Оценка: {{ review.rating }} из 5">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
            </div>
            <time class="review-date" :datetime="review.date">{{ formatDate(review.date) }}</time>
          </div>
          <p class="review-text">{{ review.text }}</p>
          <div class="review-author">
            <span class="author-name">{{ review.author }}</span>
            <span v-if="review.company" class="author-company">{{ review.company }}</span>
          </div>
        </article>
      </div>

      <p v-if="reviews.length === 0" class="no-reviews">Пока нет отзывов. Они появятся здесь после публикации.</p>
    </div>
  </div>
</template>

<script>
import reviewsData from '../data/reviews.json'

export default {
  name: 'ReviewsPage',
  data() {
    return {
      reviews: reviewsData
    }
  },
  methods: {
    formatDate(iso) {
      const d = new Date(iso + 'T12:00:00')
      return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.reviews-page {
  padding: 40px 0 80px;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 8px 0;
  text-align: center;
}

.page-desc {
  font-size: 18px;
  color: var(--text-light);
  text-align: center;
  margin-bottom: 48px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 720px;
  margin: 0 auto;
}

.review-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px var(--shadow);
  border: 1px solid var(--border);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 20px;
}

.star.filled {
  color: #f5a623;
}

.review-date {
  font-size: 14px;
  color: var(--text-light);
}

.review-text {
  font-size: 17px;
  line-height: 1.6;
  color: var(--text-dark);
  margin: 0 0 16px 0;
}

.review-author {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-weight: 600;
  color: var(--text-dark);
}

.author-company {
  font-size: 14px;
  color: var(--text-light);
}

.no-reviews {
  text-align: center;
  color: var(--text-light);
  font-size: 17px;
}

@media (max-width: 768px) {
  .reviews-page {
    padding: 28px 0 60px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-desc {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .review-card {
    padding: 20px;
  }

  .review-text {
    font-size: 16px;
  }
}
</style>
