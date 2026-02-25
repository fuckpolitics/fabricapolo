<template>
  <footer class="footer">
    <div class="container-wide">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-title">Фабрика Поло</div>
          <div class="footer-subtitle">Производство корпоративной одежды</div>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Контакты</div>
          <div class="footer-item">📞 +7 (903) 879-46-09</div>
          <div class="footer-item">📞 +7 (903) 786-80-35</div>
          <div class="footer-item">✉️ polo.zakaz@list.ru</div>
          <div class="footer-item">📍 Иваново, Кохма, Октябрьская улица д 47б цоколь</div>
          <div class="footer-buttons">
            <button @click="openReviews" class="footer-btn reviews-btn">
              ⭐ Отзывы
            </button>
            <button @click="openFeedback" class="footer-btn feedback-btn">
              💬 Обратная связь
            </button>
          </div>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Категории</div>
          <router-link class="footer-link" to="/category/polo">Поло</router-link>
          <router-link class="footer-link" to="/category/uniform">Форменная одежда</router-link>
          <router-link class="footer-link" to="/category/hoodies">Толстовки/худи/свитшоты</router-link>
          <router-link class="footer-link" to="/category/tshirts">Футболки</router-link>
          <router-link class="footer-link" to="/category/shoppers">Шопперы</router-link>
          <router-link class="footer-link" to="/category/jackets">Жилетки/куртки</router-link>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© {{ new Date().getFullYear() }} Фабрика Поло</div>
        <div class="footer-bottom-right">Производство и брендирование одежды</div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  methods: {
    openReviews() {
      console.log('Открыть отзывы из футера')
      alert('Страница отзывов будет доступна скоро!')
    },
    
    openFeedback() {
      console.log('Открыть обратную связь из футера')
      alert('Форма обратной связи будет доступна скоро!')
    }
  }
}
</script>

<style scoped>
.footer {
  margin-top: 80px;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  color: rgba(255, 255, 255, 0.92);
  padding: 56px 0 26px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 36px;
  align-items: start;
}

.footer-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  margin-bottom: 8px;
}

.footer-subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.footer-col-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}

.footer-item {
  font-size: 16px;
  opacity: 0.95;
  margin: 8px 0;
}

.footer-link {
  display: block;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  margin: 8px 0;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 1;
}

.contact-row {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 8px;
}

.footer-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.footer-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.reviews-btn {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border-color: rgba(102, 126, 234, 0.5);
}

.reviews-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5));
}

.feedback-btn {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.3), rgba(245, 87, 108, 0.3));
  border-color: rgba(240, 147, 251, 0.5);
}

.feedback-btn:hover {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.5), rgba(245, 87, 108, 0.5));
}

.footer-bottom {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  justify-content: space-between;
  gap: 18px;
  font-size: 14px;
  opacity: 0.9;
}

.footer-bottom-right {
  text-align: right;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-bottom-right {
    text-align: left;
  }
}
</style>
