<template>
  <header class="header">
    <div class="container">
      <div class="header-top">
        <div class="logo">
          <h1>
            <router-link to="/" class="logo-link" @click="menuOpen = false">Фабрика Поло</router-link>
          </h1>
        </div>

        <button
          class="menu-toggle"
          type="button"
          aria-label="Меню"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span class="menu-toggle-bar"></span>
          <span class="menu-toggle-bar"></span>
          <span class="menu-toggle-bar"></span>
        </button>

        <div class="contacts desktop-only">
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

      <nav class="nav-menu desktop-only">
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

    <!-- Мобильное меню (бургер) -->
    <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false" aria-hidden="true"></div>
    <aside class="menu-panel" :class="{ open: menuOpen }" aria-hidden="!menuOpen">
      <div class="menu-panel-inner">
        <div class="menu-contacts">
          <div class="menu-contact-row">
            <a href="tel:+79038794609" class="menu-contact-link">📞 +7 (903) 879-46-09</a>
          </div>
          <div class="menu-contact-row">
            <a href="tel:+79037868035" class="menu-contact-link">📞 +7 (903) 786-80-35</a>
          </div>
          <div class="menu-contact-row">
            <a href="mailto:polo.zakaz@list.ru" class="menu-contact-link">✉️ polo.zakaz@list.ru</a>
          </div>
          <div class="menu-contact-row menu-address">
            <span>📍 Иваново, Кохма, Октябрьская улица д 47б цоколь</span>
          </div>
        </div>
        <div class="menu-actions">
          <button @click="closeAndOpenReviews" class="action-btn reviews-btn">
            <span class="icon">⭐</span>
            <span>Отзывы</span>
          </button>
          <button @click="closeAndOpenFeedback" class="action-btn feedback-btn">
            <span class="icon">💬</span>
            <span>Обратная связь</span>
          </button>
        </div>
        <nav class="menu-nav">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="'/category/' + category.type"
            class="menu-nav-link"
            :class="{ active: $route.params.type === category.type }"
            @click="menuOpen = false"
          >
            {{ category.name }}
          </router-link>
        </nav>
      </div>
    </aside>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  inject: ['openFeedbackModal'],
  data() {
    return {
      menuOpen: false,
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
      this.menuOpen = false
      this.$router.push('/reviews')
    },
    openFeedback() {
      this.openFeedbackModal()
    },
    closeAndOpenReviews() {
      this.menuOpen = false
      this.$router.push('/reviews')
    },
    closeAndOpenFeedback() {
      this.menuOpen = false
      this.openFeedbackModal()
    }
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
  box-shadow: 0 2px 10px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  color: rgba(255, 255, 255, 0.92);
  overflow-x: hidden;
}

.header .container {
  overflow-x: hidden;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0;
  min-height: 130px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h1 {
  margin: 0;
  margin-right: 40px;
  flex-shrink: 0;
}

.logo-link {
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  font-weight: 700;
  font-size: 42px;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.logo-link:hover {
  color: white;
}

/* Кнопка бургера — только на мобильных */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  z-index: 1002;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
}

.menu-toggle-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: white;
  border-radius: 1px;
  margin: 0 auto;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.menu-toggle[aria-expanded="true"] .menu-toggle-bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.menu-toggle[aria-expanded="true"] .menu-toggle-bar:nth-child(2) {
  opacity: 0;
}
.menu-toggle[aria-expanded="true"] .menu-toggle-bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* === CONTACTS (десктоп) === */
.contacts {
  display: flex;
  align-items: flex-start;
  gap: 36px;
}

.contacts-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contacts-row {
  display: flex;
  align-items: center;
  gap: 26px;
  flex-wrap: nowrap;
}

.contacts-row.meta {
  font-size: 17px;
  color: var(--text-light);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 16px;
}

.contact-item span:last-child {
  white-space: nowrap;
}

.contacts-row.meta .contact-item:last-child span:last-child {
  white-space: normal;
  max-width: 460px;
}

.contact-item .icon {
  font-size: 17px;
}

.action-buttons {
  display: flex;
  gap: 14px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--primary-color);
  color: white;
  -webkit-tap-highlight-color: transparent;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.reviews-btn {
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
}

.reviews-btn:hover {
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.feedback-btn {
  background: linear-gradient(135deg, #f5a623 0%, #d4870a 100%);
}

.feedback-btn:hover {
  box-shadow: 0 4px 12px rgba(245, 166, 35, 0.4);
}

.action-btn .icon {
  font-size: 17px;
}

/* === NAV (десктоп) === */
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
  padding: 22px 30px;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  font-size: 20px;
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

/* === МОБИЛЬНОЕ МЕНЮ === */
.menu-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.menu-panel {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 320px;
  background: linear-gradient(180deg, var(--primary-dark), var(--primary-color));
  z-index: 1001;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
}

.menu-panel.open {
  transform: translateX(0);
}

.menu-panel-inner {
  padding: 80px 20px 24px;
}

.menu-contacts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-contact-row {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
}

.menu-contact-link {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  display: block;
  -webkit-tap-highlight-color: transparent;
}

.menu-contact-link:hover {
  color: white;
}

.menu-address {
  white-space: normal;
  line-height: 1.4;
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-actions .action-btn {
  width: 100%;
  justify-content: center;
  min-height: 48px;
  font-size: 16px;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.menu-nav-link {
  display: block;
  padding: 16px 0;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  -webkit-tap-highlight-color: transparent;
}

.menu-nav-link:hover,
.menu-nav-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

/* === МОБИЛЬНЫЙ БРЕЙКПОИНТ: бургер + скрытие десктоп-блоков === */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .desktop-only {
    display: none !important;
  }

  .menu-backdrop {
    display: block;
  }

  .menu-panel {
    display: block;
  }

  .header-top {
    padding: 16px 0;
    min-height: auto;
  }

  .logo {
    flex: 1;
    min-width: 0;
  }

  .logo h1 {
    margin-right: 0;
  }

  .logo-link {
    font-size: 24px;
    white-space: normal;
    word-break: break-word;
  }
}
</style>
