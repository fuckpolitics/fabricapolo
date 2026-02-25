<template>
  <header class="header">
    <div class="container">
      <div class="header-top">
        <div class="logo">
          <h1>
            <router-link to="/" class="logo-link">Фабрика Поло</router-link>
          </h1>
        </div>
        <div class="contacts">
  <div class="contacts-info">
    <div class="contacts-row phones">
      <div class="contact-item">
        <span class="icon">📞</span>
        <span>+7 (903) 879-46-09</span>
      </div>
      <div class="contact-item">
        <span class="icon">📞</span>
        <span>+7 (903) 786-80-35</span>
      </div>
    </div>

    <div class="contacts-row meta">
      <div class="contact-item">
        <span class="icon">✉️</span>
        <span>polo.zakaz@list.ru</span>
      </div>
      <div class="contact-item">
        <span class="icon">📍</span>
        <span>Иваново, Кохма, Октябрьская улица д 47б цоколь</span>
      </div>
    </div>
  </div>

  <div class="action-buttons">
    <button @click="openReviews" class="action-btn reviews-btn">
      <span class="icon">⭐</span>
      <span>Отзывы</span>
    </button>
    <button @click="openFeedback" class="action-btn feedback-btn">
      <span class="icon">💬</span>
      <span>Обратная связь</span>
    </button>
  </div>
        </div>
      </div>
      <nav class="nav-menu">
        <ul>
          <li v-for="category in categories" :key="category.id">
            <router-link 
              :to="'/category/' + category.type"
              class="nav-link"
              :class="{ active: $route.params.type === category.type }"
            >
              {{ category.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      categories: [
        { id: 1, name: 'Футболки поло', type: 'polo' },
        { id: 2, name: 'Форменная одежда', type: 'uniform' },
        { id: 3, name: 'Трикотаж', type: 'hoodies' },
        { id: 4, name: 'Жилетки/куртки/ветровки', type: 'jackets' },
        { id: 5, name: 'Промо текстиль', type: 'shoppers' }
      ]
    }
  },
  methods: {
    openReviews() {
      // Здесь можно добавить логику для открытия страницы с отзывами
      console.log('Открыть отзывы')
      // Например, переход на страницу /reviews или открытие модального окна
      alert('Страница отзывов будет доступна скоро!')
    },
    
    openFeedback() {
      // Здесь можно добавить логику для открытия формы обратной связи
      console.log('Открыть обратную связь')
      // Например, переход на страницу /feedback или открытие модального окна
      alert('Форма обратной связи будет доступна скоро!')
    }
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 10px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  color: rgba(255, 255, 255, 0.92);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0; /* было 36 */
  min-height: 130px; /* было 120 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* === LOGO === */

.logo h1 {
  margin: 0;
  margin-right: 40px;
  flex-shrink: 0;
}

.logo-link {
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  font-weight: 700;
  font-size: 32px; /* было 28 */
  transition: color 0.3s ease;
  white-space: nowrap;
}

.logo-link:hover {
  color: white;
}

/* === CONTACTS === */

.contacts {
  display: flex;
  align-items: flex-start;
  gap: 36px; /* было 32 */
}

.contacts-info {
  display: flex;
  flex-direction: column;
  gap: 12px; /* было 10 */
}

.contacts-row {
  display: flex;
  align-items: center;
  gap: 26px; /* было 24 */
  flex-wrap: nowrap;
}

.contacts-row.meta {
  font-size: 17px; /* было 16 */
  color: var(--text-light);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 16px; /* было 14 */
}

.contact-item .icon {
  font-size: 17px; /* было 16 */
}

/* адрес */
.contacts-row.meta .contact-item:last-child {
  white-space: normal;
  max-width: 460px; /* было 420 */
}

/* === ACTION BUTTONS === */

.action-buttons {
  display: flex;
  gap: 14px; /* было 12 */
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px; /* было 8 16 */
  border: none;
  border-radius: 8px;
  font-size: 17px; /* было 16 */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--primary-color);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.reviews-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.reviews-btn:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.feedback-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.feedback-btn:hover {
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.action-btn .icon {
  font-size: 17px;
}

/* === NAV MENU === */

.nav-menu {
  padding: 0;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: block;
  padding: 22px 30px; /* было 20 28 */
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  font-size: 20px; /* было 18 */
  font-weight: 600;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  color: white;
  border-bottom-color: white;
}

/* === MOBILE === */

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 24px;
    padding: 32px 0;
  }

  .logo-link {
    font-size: 30px; /* было 28 */
  }

  .contact-item {
    font-size: 15px; /* было 14 */
  }

  .contact-item .icon {
    font-size: 15px;
  }

  .action-btn {
    font-size: 15px;
    padding: 8px 14px;
  }

  .nav-link {
    font-size: 17px; /* было 16 */
    padding: 16px 20px;
  }
}
</style>
