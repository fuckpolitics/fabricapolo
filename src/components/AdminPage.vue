<template>
  <div class="admin-page">

    <!-- PIN screen -->
    <div v-if="!authenticated" class="auth-screen">
      <div class="auth-card">
        <h1 class="auth-title">Панель управления</h1>
        <p class="auth-subtitle">Введите PIN-код для доступа</p>
        <form @submit.prevent="checkPin">
          <input
            v-model="pinInput"
            type="password"
            class="auth-input"
            placeholder="PIN"
            autocomplete="current-password"
          />
          <p v-if="pinError" class="auth-error">Неверный PIN</p>
          <button type="submit" class="btn-primary">Войти</button>
        </form>
      </div>
    </div>

    <!-- Main CMS -->
    <div v-else class="cms-layout">
      <header class="cms-header">
        <h1 class="cms-logo">CMS — Фабрика Поло</h1>
        <button class="btn-logout" @click="logout">Выйти</button>
      </header>

      <div class="cms-body">

        <!-- GitHub token setup -->
        <section v-if="!tokenConfirmed" class="token-section card">
          <h2>Подключение к GitHub</h2>
          <p class="hint">
            Нужен Personal Access Token с правом <code>contents: write</code>.
            <a href="https://github.com/settings/tokens/new?scopes=repo&description=FabrikaPolo+CMS" target="_blank" rel="noopener">Создать токен</a>
          </p>
          <div class="token-row">
            <input
              v-model="githubToken"
              type="password"
              class="token-input"
              placeholder="ghp_xxxxxxxxxxxxxxxx"
            />
            <button class="btn-primary" :disabled="tokenChecking" @click="confirmToken">
              {{ tokenChecking ? 'Проверка...' : 'Подключить' }}
            </button>
          </div>
          <p v-if="tokenError" class="auth-error">{{ tokenError }}</p>
        </section>

        <template v-else>
        <!-- Category tabs -->
          <div class="tabs">
            <button
              v-for="cat in categories"
              :key="cat.key"
              class="tab"
              :class="{ active: activeTab === cat.key }"
              @click="activeTab = cat.key"
            >
              {{ cat.label }}
            </button>
            <button
              class="tab tab--reviews"
              :class="{ active: activeTab === 'reviews' }"
              @click="activeTab = 'reviews'"
            >
              Отзывы
            </button>
            <button
              class="tab tab--content"
              :class="{ active: activeTab === 'content' }"
              @click="activeTab = 'content'"
            >
              Тексты
            </button>
            <button
              class="tab tab--analytics"
              :class="{ active: activeTab === 'analytics' }"
              @click="switchToAnalytics"
            >
              Аналитика
            </button>
          </div>

          <!-- Analytics tab -->
          <div v-if="activeTab === 'analytics'" class="analytics-section">

            <!-- Not configured -->
            <div v-if="!metrikaReady" class="card analytics-setup">
              <h2>Подключение Яндекс Метрики</h2>
              <p class="hint">Нужен OAuth-токен и ID счётчика Метрики. Инструкция по получению — в документации проекта.</p>
              <div class="field-group">
                <label>OAuth-токен</label>
                <input v-model="metrikaTokenInput" type="password" class="field-input" placeholder="y0_AgAAAA..." />
              </div>
              <div class="field-group">
                <label>ID счётчика</label>
                <input v-model="metrikaCounterInput" type="text" class="field-input field-input--short" placeholder="12345678" />
              </div>
              <p v-if="metrikaError" class="auth-error">{{ metrikaError }}</p>
              <button class="btn-primary" :disabled="metrikaConnecting" @click="connectMetrika">
                {{ metrikaConnecting ? 'Проверка...' : 'Подключить' }}
              </button>
            </div>

            <!-- Configured — show stats -->
            <template v-else>
              <!-- Period selector -->
              <div class="analytics-toolbar">
                <div class="period-tabs">
                  <button
                    v-for="p in periods"
                    :key="p.value"
                    class="period-tab"
                    :class="{ active: analyticsPeriod === p.value }"
                    @click="setAnalyticsPeriod(p.value)"
                  >{{ p.label }}</button>
                </div>
                <button class="btn-refresh" :disabled="analyticsLoading" @click="loadAnalytics">
                  {{ analyticsLoading ? '...' : '↻ Обновить' }}
                </button>
              </div>

              <p v-if="analyticsError" class="auth-error card" style="padding:14px">{{ analyticsError }}</p>

              <!-- Summary cards -->
              <div v-if="analyticsSummary" class="stat-cards">
                <div class="stat-card">
                  <div class="stat-value">{{ fmt(analyticsSummary.visits) }}</div>
                  <div class="stat-label">Визиты</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ fmt(analyticsSummary.users) }}</div>
                  <div class="stat-label">Посетители</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ analyticsSummary.bounceRate }}%</div>
                  <div class="stat-label">Отказы</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ analyticsSummary.avgDuration }}</div>
                  <div class="stat-label">Ср. время</div>
                </div>
              </div>

              <div class="analytics-grid">
                <!-- Visits chart -->
                <div class="card analytics-card analytics-card--wide">
                  <h4 class="analytics-card-title">Визиты по дням</h4>
                  <div v-if="analyticsLoading" class="analytics-loading">Загрузка...</div>
                  <div v-else-if="visitsByDay.length" class="bar-chart">
                    <div
                      v-for="day in visitsByDay"
                      :key="day.date"
                      class="bar-col"
                    >
                      <div class="bar-wrap">
                        <div
                          class="bar"
                          :style="{ height: day.heightPct + '%' }"
                          :title="day.date + ': ' + day.visits + ' визитов'"
                        ></div>
                      </div>
                      <div class="bar-label">{{ day.shortDate }}</div>
                    </div>
                  </div>
                  <p v-else class="no-data">Нет данных</p>
                </div>

                <!-- Traffic sources -->
                <div class="card analytics-card">
                  <h4 class="analytics-card-title">Источники трафика</h4>
                  <div v-if="analyticsLoading" class="analytics-loading">Загрузка...</div>
                  <div v-else-if="trafficSources.length" class="donut-section">
                    <div class="source-list">
                      <div v-for="src in trafficSources" :key="src.name" class="source-row">
                        <div class="source-dot" :style="{ background: src.color }"></div>
                        <span class="source-name">{{ src.name }}</span>
                        <span class="source-bar-wrap">
                          <span class="source-bar" :style="{ width: src.pct + '%', background: src.color }"></span>
                        </span>
                        <span class="source-val">{{ src.pct }}%</span>
                      </div>
                    </div>
                  </div>
                  <p v-else class="no-data">Нет данных</p>
                </div>

                <!-- Devices -->
                <div class="card analytics-card">
                  <h4 class="analytics-card-title">Устройства</h4>
                  <div v-if="analyticsLoading" class="analytics-loading">Загрузка...</div>
                  <div v-else-if="devices.length" class="device-list">
                    <div v-for="dev in devices" :key="dev.name" class="device-row">
                      <span class="device-icon">{{ dev.icon }}</span>
                      <span class="device-name">{{ dev.name }}</span>
                      <div class="device-bar-wrap">
                        <div class="device-bar" :style="{ width: dev.pct + '%' }"></div>
                      </div>
                      <span class="device-val">{{ dev.pct }}%</span>
                    </div>
                  </div>
                  <p v-else class="no-data">Нет данных</p>
                </div>

                <!-- Top pages -->
                <div class="card analytics-card analytics-card--wide">
                  <h4 class="analytics-card-title">Популярные страницы</h4>
                  <div v-if="analyticsLoading" class="analytics-loading">Загрузка...</div>
                  <div v-else-if="topPages.length" class="pages-table">
                    <div v-for="(page, i) in topPages" :key="page.url" class="page-row">
                      <span class="page-rank">{{ i + 1 }}</span>
                      <span class="page-url">{{ page.url }}</span>
                      <span class="page-views">{{ fmt(page.views) }} просм.</span>
                    </div>
                  </div>
                  <p v-else class="no-data">Нет данных</p>
                </div>
              </div>
            </template>
          </div>

          <!-- Reviews editor -->
          <div v-if="isReviewsTab" class="reviews-editor">
            <div
              v-for="(review, idx) in reviews"
              :key="review.id"
              class="review-editor card"
            >
              <div class="review-editor-header">
                <span class="review-num">Отзыв {{ idx + 1 }}</span>
                <button class="btn-delete-review" @click="deleteReview(idx)">Удалить</button>
              </div>
              <div class="review-fields">
                <div class="field-group">
                  <label>Автор</label>
                  <input v-model="review.author" type="text" class="field-input" placeholder="Иван И." />
                </div>
                <div class="field-group">
                  <label>Компания</label>
                  <input v-model="review.company" type="text" class="field-input" placeholder="ООО «...» (необязательно)" />
                </div>
                <div class="field-group">
                  <label>Текст отзыва</label>
                  <textarea v-model="review.text" class="field-input field-textarea" rows="4" />
                </div>
                <div class="review-meta">
                  <div class="field-group">
                    <label>Дата</label>
                    <input v-model="review.date" type="date" class="field-input field-input--short" />
                  </div>
                  <div class="field-group">
                    <label>Оценка</label>
                    <div class="star-picker">
                      <button
                        v-for="n in 5"
                        :key="n"
                        class="star-btn"
                        :class="{ filled: n <= review.rating }"
                        @click="review.rating = n"
                      >★</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn-add-review" @click="addReview">+ Добавить отзыв</button>
          </div>

          <!-- Content texts editor -->
          <div v-else-if="activeTab === 'content'" class="content-editor">
            <div class="card content-section">
              <h3 class="content-section-title">Главная страница — Герой</h3>
              <div class="field-group">
                <label>Заголовок</label>
                <input v-model="content.home.hero.title" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Подзаголовок</label>
                <textarea v-model="content.home.hero.subtitle" class="field-input field-textarea" rows="2" />
              </div>
            </div>

            <div class="card content-section">
              <h3 class="content-section-title">Главная страница — Блок производства</h3>
              <div class="field-group">
                <label>Заголовок</label>
                <input v-model="content.home.split.title" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Текст</label>
                <textarea v-model="content.home.split.text" class="field-input field-textarea" rows="3" />
              </div>
              <div class="content-two-col">
                <div class="field-group">
                  <label>Пункт 1 — заголовок</label>
                  <input v-model="content.home.split.point1Title" type="text" class="field-input" />
                </div>
                <div class="field-group">
                  <label>Пункт 1 — текст</label>
                  <input v-model="content.home.split.point1Text" type="text" class="field-input" />
                </div>
                <div class="field-group">
                  <label>Пункт 2 — заголовок</label>
                  <input v-model="content.home.split.point2Title" type="text" class="field-input" />
                </div>
                <div class="field-group">
                  <label>Пункт 2 — текст</label>
                  <input v-model="content.home.split.point2Text" type="text" class="field-input" />
                </div>
              </div>
            </div>

            <div class="card content-section">
              <h3 class="content-section-title">Главная страница — Категории</h3>
              <div
                v-for="cat in content.home.categories"
                :key="cat.type"
                class="content-category-row"
              >
                <div class="content-category-type">{{ cat.type }}</div>
                <div class="field-group" style="flex:1">
                  <label>Название</label>
                  <input v-model="cat.name" type="text" class="field-input" />
                </div>
                <div class="field-group" style="flex:2">
                  <label>Описание</label>
                  <input v-model="cat.description" type="text" class="field-input" />
                </div>
              </div>
            </div>

            <div class="card content-section">
              <h3 class="content-section-title">Страница «О нас»</h3>
              <div class="field-group">
                <label>Заголовок H1</label>
                <input v-model="content.about.heroTitle" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Подзаголовок</label>
                <input v-model="content.about.heroSubtitle" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Вводный абзац</label>
                <textarea v-model="content.about.heroLead" class="field-input field-textarea" rows="3" />
              </div>
              <div class="field-group">
                <label>Заголовок «Производство»</label>
                <input v-model="content.about.productionTitle" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Текст «Производство»</label>
                <textarea v-model="content.about.productionText" class="field-input field-textarea" rows="3" />
              </div>
              <div class="field-group">
                <label>Заголовок «Преимущества»</label>
                <input v-model="content.about.advantagesTitle" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Пункты преимуществ (каждый с новой строки)</label>
                <textarea
                  :value="content.about.advantages.join('\n')"
                  class="field-input field-textarea"
                  rows="7"
                  @input="content.about.advantages = $event.target.value.split('\n').filter(s => s.trim())"
                />
              </div>
              <div class="field-group">
                <label>Заголовок «Контроль качества»</label>
                <input v-model="content.about.qualityTitle" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Текст «Контроль качества»</label>
                <textarea v-model="content.about.qualityText" class="field-input field-textarea" rows="3" />
              </div>
              <div class="field-group">
                <label>Заголовок «Партнёрство»</label>
                <input v-model="content.about.partnershipTitle" type="text" class="field-input" />
              </div>
              <div class="field-group">
                <label>Текст «Партнёрство»</label>
                <textarea v-model="content.about.partnershipText" class="field-input field-textarea" rows="2" />
              </div>
            </div>
          </div>

          <!-- Products in active category -->
          <div v-else class="products-list">
            <div
              v-for="product in currentProducts"
              :key="product.id"
              class="product-editor card"
            >
              <div class="product-editor-header" @click="toggleProduct(product.id)">
                <span class="product-editor-name">{{ product.name }}</span>
                <span class="chevron" :class="{ open: openProducts.has(product.id) }">▾</span>
              </div>

              <div v-show="openProducts.has(product.id)" class="product-editor-body">
                <!-- Text fields -->
                <div class="field-group">
                  <label>Название</label>
                  <input v-model="product.name" type="text" class="field-input" />
                </div>
                <div class="field-group">
                  <label>Описание</label>
                  <textarea v-model="product.description" class="field-input field-textarea" rows="3" />
                </div>
                <div class="field-group field-group--inline">
                  <label>Цена (₽)</label>
                  <input v-model.number="product.price" type="number" class="field-input field-input--short" />
                </div>

                <!-- Photo manager -->
                <div class="photo-section">
                  <div class="photo-section-header">
                    <h4>Фотографии</h4>
                    <label class="btn-upload">
                      + Добавить фото
                      <input type="file" accept="image/*" multiple hidden @change="e => onFileUpload(e, product)" />
                    </label>
                  </div>

                  <p v-if="!getDisplayPhotos(product).length" class="no-photos">
                    Нет фотографий. Загрузите изображения или добавьте их в папку
                    <code>src/img/products/{{ activeCategory }}/{{ product.slug }}/</code>
                  </p>

                  <div
                    v-else
                    class="photos-grid"
                    @dragover.prevent
                    @drop.prevent="e => onDrop(e, product)"
                  >
                    <div
                      v-for="(photo, idx) in getDisplayPhotos(product)"
                      :key="photo.filename"
                      class="photo-item"
                      :class="{ dragging: draggingId === photo.filename }"
                      draggable="true"
                      @dragstart="onDragStart($event, photo.filename)"
                      @dragenter.prevent="onDragEnter($event, photo.filename, product)"
                      @dragend="draggingId = null"
                    >
                      <img :src="photo.url" :alt="photo.filename" class="photo-thumb" />
                      <div class="photo-overlay">
                        <span class="photo-index">{{ idx + 1 }}</span>
                        <button class="btn-delete-photo" title="Удалить" @click="deletePhoto(product, photo)">✕</button>
                      </div>
                      <p class="photo-filename">{{ photo.filename }}</p>
                    </div>
                  </div>

                  <p class="drag-hint" v-if="getDisplayPhotos(product).length > 1">
                    Перетащите карточки для изменения порядка
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- /v-else products list -->

          <!-- Save button — hidden on analytics tab -->
          <div v-if="activeTab !== 'analytics'" class="save-bar">
            <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
              {{ saveStatus.message }}
            </div>
            <button class="btn-save" :disabled="saving || !hasChanges" @click="saveAll">
              {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </div>

          <!-- Pending uploads indicator -->
          <div v-if="pendingUploads.length" class="pending-uploads card">
            <h4>Очередь загрузки ({{ pendingUploads.length }})</h4>
            <ul>
              <li v-for="u in pendingUploads" :key="u.id">
                {{ u.name }} — <em>{{ u.status }}</em>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { GitHubApi, fileToBase64 } from '../utils/githubApi.js'
import { fileSystemManager } from '../utils/fileSystemManager.js'
import { MetrikaApi } from '../utils/metrikaApi.js'
import productsSource from '../data/products.json'
import reviewsSource from '../data/reviews.json'
import contentSource from '../data/content.json'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'admin'
const GH_OWNER = import.meta.env.VITE_GITHUB_OWNER || ''
const GH_REPO = import.meta.env.VITE_GITHUB_REPO || ''
const GH_TOKEN_PRESET = import.meta.env.VITE_GITHUB_TOKEN || ''
const METRIKA_TOKEN_PRESET = import.meta.env.VITE_METRIKA_TOKEN || ''
const METRIKA_COUNTER_PRESET = import.meta.env.VITE_METRIKA_ID || ''
const SESSION_KEY = 'cms_auth'
const METRIKA_SESSION_KEY = 'cms_metrika'

export default {
  name: 'AdminPage',

  data() {
    const products = JSON.parse(JSON.stringify(productsSource))
    for (const [category, list] of Object.entries(products)) {
      for (const product of list) {
        product._category = category
        product._photos = this._buildPhotoList(category, product)
      }
    }

    const api = GH_TOKEN_PRESET
      ? new GitHubApi(GH_TOKEN_PRESET, GH_OWNER, GH_REPO)
      : null

    return {
      // Auth — restore from sessionStorage so page reloads don't require re-login
      authenticated: sessionStorage.getItem(SESSION_KEY) === '1',
      pinInput: '',
      pinError: false,

      // GitHub
      githubToken: '',
      tokenConfirmed: !!GH_TOKEN_PRESET,
      tokenChecking: false,
      tokenError: '',
      api,

      // Products (mutable copy)
      products,

      // Reviews (mutable copy)
      reviews: JSON.parse(JSON.stringify(reviewsSource)),

      // Content texts (mutable copy)
      content: JSON.parse(JSON.stringify(contentSource)),

      // UI state
      activeTab: 'polo',   // category key or 'reviews'
      categories: [
        { key: 'polo', label: 'Поло' },
        { key: 'uniform', label: 'Форма' },
        { key: 'hoodies', label: 'Худи' },
        { key: 'jackets', label: 'Куртки' },
        { key: 'shoppers', label: 'Промо' }
      ],
      openProducts: new Set(),

      // Drag & drop
      draggingId: null,

      // Save
      saving: false,
      saveStatus: null,
      pendingUploads: [],
      _initialSignature: null,

      // Metrika
      metrikaTokenInput: '',
      metrikaCounterInput: '',
      metrikaError: '',
      metrikaConnecting: false,
      metrikaApi: null,
      metrikaReady: false,
      analyticsLoading: false,
      analyticsError: '',
      analyticsPeriod: 30,
      periods: [
        { value: 7, label: '7 дней' },
        { value: 30, label: '30 дней' },
        { value: 90, label: '90 дней' }
      ],
      analyticsSummary: null,
      visitsByDay: [],
      trafficSources: [],
      devices: [],
      topPages: []
    }
  },

  computed: {
    isReviewsTab() {
      return this.activeTab === 'reviews'
    },
    currentProducts() {
      return this.products[this.activeTab] || []
    },
    _stateSignature() {
      const productsSig = {}
      for (const [cat, list] of Object.entries(this.products)) {
        productsSig[cat] = list.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          photos: (p._photos || []).map(ph => ph.filename),
          deleted: p._deletedPhotos || []
        }))
      }
      return JSON.stringify({ products: productsSig, reviews: this.reviews, content: this.content })
    },
    hasChanges() {
      return this._stateSignature !== this._initialSignature || this.pendingUploads.length > 0
    }
  },

  created() {
    // Snapshot initial state for dirty-check
    this.$nextTick(() => {
      this._initialSignature = this._stateSignature
    })

    // Restore Metrika session
    const saved = sessionStorage.getItem(METRIKA_SESSION_KEY)
    if (saved) {
      try {
        const { token, counter } = JSON.parse(saved)
        this.metrikaApi = new MetrikaApi(token, counter)
        this.metrikaReady = true
      } catch {}
    }
    // If preset via env vars — use immediately
    if (!this.metrikaReady && METRIKA_TOKEN_PRESET && METRIKA_COUNTER_PRESET) {
      this.metrikaApi = new MetrikaApi(METRIKA_TOKEN_PRESET, METRIKA_COUNTER_PRESET)
      this.metrikaReady = true
    }
  },

  methods: {
    // ---- Auth ----

    checkPin() {
      if (this.pinInput === ADMIN_PIN) {
        this.authenticated = true
        this.pinError = false
        sessionStorage.setItem(SESSION_KEY, '1')
      } else {
        this.pinError = true
        this.pinInput = ''
      }
    },

    logout() {
      this.authenticated = false
      sessionStorage.removeItem(SESSION_KEY)
    },

    // ---- GitHub ----

    async confirmToken() {
      if (!this.githubToken.trim()) {
        this.tokenError = 'Введите токен'
        return
      }
      this.tokenChecking = true
      this.tokenError = ''
      try {
        this.api = new GitHubApi(this.githubToken.trim(), GH_OWNER, GH_REPO)
        const ok = await this.api.validateToken()
        if (ok) {
          this.tokenConfirmed = true
        } else {
          this.tokenError = 'Токен недействителен или нет прав на этот репозиторий'
          this.api = null
        }
      } catch (e) {
        this.tokenError = 'Ошибка соединения: ' + e.message
        this.api = null
      } finally {
        this.tokenChecking = false
      }
    },

    // ---- Helpers ----

    _buildPhotoList(category, product) {
      const imageOrder = product.imageOrder || []
      const map = fileSystemManager.getImageMapForDirectory(category, product.slug)
      const photos = []

      if (imageOrder.length > 0) {
        for (const fn of imageOrder) {
          if (map[fn]) photos.push({ filename: fn, url: map[fn], isNew: false })
        }
        for (const [fn, url] of Object.entries(map)) {
          if (!imageOrder.includes(fn)) photos.push({ filename: fn, url, isNew: false })
        }
      } else {
        const sorted = fileSystemManager.sortImageFiles(Object.values(map))
        for (const url of sorted) {
          const fn = Object.entries(map).find(([, u]) => u === url)?.[0]
          if (fn) photos.push({ filename: fn, url, isNew: false })
        }
      }

      return photos
    },

    getDisplayPhotos(product) {
      return product._photos || []
    },

    toggleProduct(id) {
      const next = new Set(this.openProducts)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      this.openProducts = next
    },

    // ---- Reviews ----

    addReview() {
      const maxId = this.reviews.reduce((m, r) => Math.max(m, r.id), 0)
      this.reviews.push({
        id: maxId + 1,
        author: '',
        company: '',
        text: '',
        date: new Date().toISOString().slice(0, 10),
        rating: 5
      })
    },

    deleteReview(index) {
      if (!confirm('Удалить отзыв?')) return
      this.reviews.splice(index, 1)
    },

    // ---- Drag & drop ----

    onDragStart(event, filename) {
      this.draggingId = filename
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', filename)
    },

    onDragEnter(event, targetFilename, product) {
      if (!this.draggingId || this.draggingId === targetFilename) return
      const photos = product._photos
      const fromIdx = photos.findIndex(p => p.filename === this.draggingId)
      const toIdx = photos.findIndex(p => p.filename === targetFilename)
      if (fromIdx === -1 || toIdx === -1) return
      const reordered = [...photos]
      const [item] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, item)
      product._photos = reordered
    },

    onDrop() {
      this.draggingId = null
    },

    // ---- File upload ----

    async onFileUpload(event, product) {
      const files = Array.from(event.target.files)
      event.target.value = ''
      if (!files.length) return

      for (const file of files) {
        const uploadEntry = { id: Date.now() + Math.random(), name: file.name, status: 'ожидание' }
        this.pendingUploads.push(uploadEntry)

        try {
          uploadEntry.status = '⏳ конвертация...'
          const base64 = await fileToBase64(file)
          const objectUrl = URL.createObjectURL(file)
          product._photos.push({ filename: file.name, url: objectUrl, isNew: true, base64, file })
          uploadEntry.status = '✅ готово к сохранению'
        } catch (e) {
          uploadEntry.status = '❌ ошибка: ' + e.message
        }
      }
    },

    // ---- Delete photo ----

    deletePhoto(product, photo) {
      if (!confirm(`Удалить фото "${photo.filename}"? Применится после нажатия "Сохранить".`)) return
      product._photos = product._photos.filter(p => p.filename !== photo.filename)
      if (!product._deletedPhotos) product._deletedPhotos = []
      if (!photo.isNew) product._deletedPhotos.push(photo.filename)
    },

    // ---- Analytics ----

    async connectMetrika() {
      if (!this.metrikaTokenInput.trim() || !this.metrikaCounterInput.trim()) {
        this.metrikaError = 'Заполните оба поля'
        return
      }
      this.metrikaConnecting = true
      this.metrikaError = ''
      try {
        const api = new MetrikaApi(this.metrikaTokenInput.trim(), this.metrikaCounterInput.trim())
        const ok = await api.validate()
        if (!ok) {
          this.metrikaError = 'Токен или ID счётчика неверны'
          return
        }
        this.metrikaApi = api
        this.metrikaReady = true
        sessionStorage.setItem(METRIKA_SESSION_KEY, JSON.stringify({
          token: this.metrikaTokenInput.trim(),
          counter: this.metrikaCounterInput.trim()
        }))
        this.loadAnalytics()
      } catch (e) {
        this.metrikaError = 'Ошибка: ' + e.message
      } finally {
        this.metrikaConnecting = false
      }
    },

    switchToAnalytics() {
      this.activeTab = 'analytics'
      if (this.metrikaReady && !this.analyticsSummary) {
        this.loadAnalytics()
      }
    },

    setAnalyticsPeriod(days) {
      this.analyticsPeriod = days
      this.loadAnalytics()
    },

    async loadAnalytics() {
      if (!this.metrikaApi) return
      this.analyticsLoading = true
      this.analyticsError = ''
      try {
        const days = this.analyticsPeriod
        const [summary, byDay, sources, devs, pages] = await Promise.all([
          this.metrikaApi.getSummary(days),
          this.metrikaApi.getVisitsByDay(days),
          this.metrikaApi.getTrafficSources(days),
          this.metrikaApi.getDevices(days),
          this.metrikaApi.getTopPages(days)
        ])

        // Summary
        const totals = summary.totals || []
        this.analyticsSummary = {
          visits: Math.round(totals[0] || 0),
          users: Math.round(totals[1] || 0),
          bounceRate: Math.round((totals[2] || 0) * 10) / 10,
          avgDuration: this._fmtSeconds(totals[4] || 0)
        }

        // Visits by day chart
        const dayData = (byDay.data || []).map(row => ({
          date: row.dimensions?.[0]?.name || '',
          visits: Math.round(row.metrics?.[0] || 0)
        }))
        const maxV = Math.max(...dayData.map(d => d.visits), 1)
        this.visitsByDay = dayData.map(d => ({
          ...d,
          shortDate: d.date.slice(5),
          heightPct: Math.max(4, Math.round((d.visits / maxV) * 100))
        }))

        // Traffic sources
        const srcTotal = (sources.data || []).reduce((s, r) => s + (r.metrics?.[0] || 0), 0) || 1
        const srcColors = ['#722f37', '#e57373', '#ef9a9a', '#ffcdd2', '#b71c1c', '#d32f2f', '#f44336', '#e53935']
        this.trafficSources = (sources.data || []).map((row, i) => ({
          name: row.dimensions?.[0]?.name || '—',
          visits: Math.round(row.metrics?.[0] || 0),
          pct: Math.round(((row.metrics?.[0] || 0) / srcTotal) * 100),
          color: srcColors[i % srcColors.length]
        }))

        // Devices
        const devTotal = (devs.data || []).reduce((s, r) => s + (r.metrics?.[0] || 0), 0) || 1
        const devIcons = { desktop: '🖥️', mobile: '📱', tablet: '📲' }
        const devNames = { desktop: 'Десктоп', mobile: 'Мобильный', tablet: 'Планшет' }
        this.devices = (devs.data || []).map(row => {
          const key = (row.dimensions?.[0]?.name || '').toLowerCase()
          return {
            name: devNames[key] || row.dimensions?.[0]?.name || '—',
            icon: devIcons[key] || '💻',
            visits: Math.round(row.metrics?.[0] || 0),
            pct: Math.round(((row.metrics?.[0] || 0) / devTotal) * 100)
          }
        })

        // Top pages
        this.topPages = (pages.data || []).map(row => ({
          url: row.dimensions?.[0]?.name || '/',
          views: Math.round(row.metrics?.[0] || 0)
        }))
      } catch (e) {
        this.analyticsError = 'Ошибка загрузки: ' + e.message
      } finally {
        this.analyticsLoading = false
      }
    },

    fmt(n) {
      return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
    },

    _fmtSeconds(sec) {
      const m = Math.floor(sec / 60)
      const s = Math.round(sec % 60)
      return m > 0 ? `${m}м ${s}с` : `${s}с`
    },

    // ---- Save ----

    async saveAll() {
      if (!this.api) {
        this.saveStatus = { type: 'error', message: 'Не подключён GitHub токен' }
        return
      }
      this.saving = true
      this.saveStatus = null

      try {
        // 1. Upload new images
        for (const [category, list] of Object.entries(this.products)) {
          for (const product of list) {
            const newPhotos = (product._photos || []).filter(p => p.isNew && p.base64)
            for (const photo of newPhotos) {
              const entry = this.pendingUploads.find(u => u.name === photo.filename)
              if (entry) entry.status = '☁️ загрузка...'
              const repoPath = `src/img/products/${category}/${product.slug}/${photo.filename}`
              await this.api.uploadNewFile(repoPath, photo.base64, `CMS: upload ${photo.filename}`)
              photo.isNew = false
              delete photo.base64
              delete photo.file
              if (entry) entry.status = '✅ загружено'
            }

            // 2. Delete removed images
            for (const filename of product._deletedPhotos || []) {
              const repoPath = `src/img/products/${category}/${product.slug}/${filename}`
              await this.api.deleteFile(repoPath, `CMS: delete ${filename}`)
            }
            product._deletedPhotos = []
          }
        }

        // 3. Build and push products.json + reviews.json in one commit
        const updatedProducts = {}
        for (const [category, list] of Object.entries(this.products)) {
          updatedProducts[category] = list.map(product => ({
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            price: product.price,
            imageOrder: (product._photos || []).map(p => p.filename)
          }))
        }

        const updatedReviews = this.reviews.map(r => ({
          id: r.id,
          author: r.author,
          company: r.company,
          text: r.text,
          date: r.date,
          rating: r.rating
        }))

        await this.api.updateProductsAndReviews(updatedProducts, updatedReviews, this.content)

        this.pendingUploads = []
        this._initialSignature = this._stateSignature
        this.saveStatus = { type: 'success', message: '✅ Сохранено! Деплой запущен, изменения появятся через ~2 минуты.' }
      } catch (e) {
        if (e.message && e.message.includes('422')) {
          this.pendingUploads = []
          this._initialSignature = this._stateSignature
          this.saveStatus = { type: 'success', message: '✅ Сохранено! Деплой запущен, изменения появятся через ~2 минуты.' }
        } else {
          this.saveStatus = { type: 'error', message: '❌ Ошибка: ' + e.message }
        }
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f4f5f7;
  font-family: inherit;
}

/* ---- Auth ---- */
.auth-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.auth-subtitle {
  color: #666;
  margin-bottom: 28px;
  font-size: 15px;
}

.auth-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 18px;
  text-align: center;
  letter-spacing: 4px;
  box-sizing: border-box;
  outline: none;
  margin-bottom: 14px;
  transition: border-color 0.2s;
}

.auth-input:focus {
  border-color: var(--primary-color);
}

.auth-error {
  color: #e53935;
  font-size: 14px;
  margin-bottom: 10px;
}

/* ---- CMS layout ---- */
.cms-header {
  background: var(--primary-color);
  color: white;
  padding: 0 32px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.cms-logo {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.cms-body {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 80px;
}

/* ---- Card ---- */
.card {
  background: white;
  border-radius: 14px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.07);
  padding: 24px;
  margin-bottom: 20px;
}

/* ---- Token section ---- */
.token-section h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.hint {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.hint a {
  color: var(--primary-color);
}

.token-row {
  display: flex;
  gap: 12px;
}

.token-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  font-family: monospace;
}

.token-input:focus {
  border-color: var(--primary-color);
}

/* ---- Tabs ---- */
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.tab {
  padding: 9px 20px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  background: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tab.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* ---- Product editor ---- */
.product-editor {
  padding: 0;
  overflow: hidden;
}

.product-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  cursor: pointer;
  user-select: none;
}

.product-editor-header:hover {
  background: #fafafa;
}

.product-editor-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-dark, #1a1a1a);
}

.chevron {
  font-size: 20px;
  color: #999;
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

.product-editor-body {
  padding: 0 24px 24px;
  border-top: 1px solid #f0f0f0;
}

/* ---- Fields ---- */
.field-group {
  margin-bottom: 16px;
}

.field-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: var(--primary-color);
}

.field-textarea {
  resize: vertical;
  min-height: 70px;
}

.field-group--inline {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-group--inline label {
  margin-bottom: 0;
  white-space: nowrap;
}

.field-input--short {
  width: 140px;
}

/* ---- Photos ---- */
.photo-section {
  margin-top: 20px;
}

.photo-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.photo-section-header h4 {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.no-photos {
  color: #999;
  font-size: 14px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  text-align: center;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.photo-item {
  position: relative;
  cursor: grab;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: border-color 0.2s, transform 0.15s, opacity 0.2s;
}

.photo-item:active {
  cursor: grabbing;
}

.photo-item.dragging {
  opacity: 0.45;
  transform: scale(0.96);
  border-color: var(--primary-color);
}

.photo-thumb {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px;
}

.photo-index {
  background: rgba(0,0,0,0.55);
  color: white;
  font-size: 12px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete-photo {
  background: rgba(229,57,53,0.85);
  color: white;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-delete-photo:hover {
  background: #e53935;
}

.photo-filename {
  font-size: 10px;
  color: #666;
  padding: 4px 6px;
  background: white;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drag-hint {
  font-size: 12px;
  color: #aaa;
  margin-top: 8px;
  text-align: center;
}

/* ---- Save bar ---- */
.save-bar {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid #eee;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.save-status {
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 8px;
}

.save-status.success {
  background: #e8f5e9;
  color: #2e7d32;
}

.save-status.error {
  background: #ffebee;
  color: #c62828;
}

/* ---- Pending uploads ---- */
.pending-uploads h4 {
  font-size: 15px;
  margin-bottom: 10px;
  color: #333;
}

.pending-uploads ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ---- Buttons ---- */
.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-save {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-save:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-upload {
  display: inline-block;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #333;
  transition: background 0.2s;
}

.btn-upload:hover {
  background: #e0e0e0;
}

.btn-logout {
  background: rgba(255,255,255,0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.25);
}

/* ---- Reviews editor ---- */
.reviews-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-editor {
  padding: 0;
  overflow: hidden;
}

.review-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.review-num {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-color);
}

.btn-delete-review {
  background: none;
  border: 1px solid #e53935;
  color: #e53935;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete-review:hover {
  background: #ffebee;
}

.review-fields {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.star-picker {
  display: flex;
  gap: 4px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  color: #ddd;
  padding: 0;
  line-height: 1;
  transition: color 0.15s, transform 0.1s;
}

.star-btn:hover,
.star-btn.filled {
  color: #f5a623;
}

.star-btn:hover {
  transform: scale(1.2);
}

.btn-add-review {
  align-self: flex-start;
  background: none;
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn-add-review:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(114, 47, 55, 0.03);
}

.tab--reviews {
  margin-left: auto;
}

.tab--analytics {
  background: linear-gradient(135deg, #722f37, #a0434e);
  color: white;
  border-color: transparent;
}

.tab--analytics.active,
.tab--analytics:hover {
  opacity: 0.85;
  color: white;
  border-color: transparent;
}

/* ---- Analytics ---- */
.analytics-setup h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.analytics-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.period-tabs {
  display: flex;
  gap: 6px;
}

.period-tab {
  padding: 7px 16px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  background: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.period-tab.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-refresh {
  background: none;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #555;
}

.btn-refresh:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-refresh:disabled {
  opacity: 0.5;
}

/* Summary stat cards */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 20px 16px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.07);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

/* Analytics grid */
.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.analytics-card {
  padding: 20px;
  margin-bottom: 0;
}

.analytics-card--wide {
  grid-column: 1 / -1;
}

.analytics-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.analytics-loading {
  color: #aaa;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}

.no-data {
  color: #bbb;
  font-size: 14px;
  text-align: center;
  padding: 16px 0;
}

/* Bar chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 120px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: var(--primary-color);
  border-radius: 3px 3px 0 0;
  min-height: 3px;
  transition: height 0.3s;
  opacity: 0.85;
  cursor: default;
}

.bar:hover {
  opacity: 1;
}

.bar-label {
  font-size: 9px;
  color: #aaa;
  margin-top: 4px;
  white-space: nowrap;
}

/* Traffic sources */
.source-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.source-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.source-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.source-name {
  flex: 0 0 130px;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-bar-wrap {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.source-bar {
  display: block;
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s;
}

.source-val {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  flex: 0 0 36px;
  text-align: right;
}

/* Devices */
.device-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.device-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.device-icon {
  font-size: 20px;
}

.device-name {
  flex: 0 0 100px;
  color: #444;
}

.device-bar-wrap {
  flex: 1;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.device-bar {
  height: 100%;
  background: var(--primary-color);
  border-radius: 5px;
  transition: width 0.4s;
  opacity: 0.8;
}

.device-val {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  flex: 0 0 36px;
  text-align: right;
}

/* Top pages */
.pages-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  padding: 8px 10px;
  background: #fafafa;
  border-radius: 8px;
}

.page-rank {
  font-weight: 700;
  color: var(--primary-color);
  flex: 0 0 20px;
  text-align: center;
}

.page-url {
  flex: 1;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-views {
  font-size: 13px;
  color: #888;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  .analytics-card--wide {
    grid-column: 1;
  }
  .source-name {
    flex: 0 0 90px;
  }
}
/* ── Content editor ──────────────────────────────────── */
.content-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-section {
  padding: 20px 24px;
}

.content-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(114,47,55,.12);
}

.content-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}

.content-category-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,.05);
}

.content-category-row:last-child {
  border-bottom: none;
}

.content-category-type {
  min-width: 80px;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: .05em;
  padding-top: 28px;
}

@media (max-width: 600px) {
  .content-two-col {
    grid-template-columns: 1fr;
  }
  .content-category-row {
    flex-direction: column;
    gap: 4px;
  }
  .content-category-type {
    padding-top: 0;
  }
}
</style>
