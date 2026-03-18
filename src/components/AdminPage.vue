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

          <!-- Save button -->
          <div class="save-bar">
            <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
              {{ saveStatus.message }}
            </div>
            <button class="btn-save" :disabled="saving" @click="saveAll">
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
import productsSource from '../data/products.json'
import reviewsSource from '../data/reviews.json'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'admin'
const GH_OWNER = import.meta.env.VITE_GITHUB_OWNER || ''
const GH_REPO = import.meta.env.VITE_GITHUB_REPO || ''
const GH_TOKEN_PRESET = import.meta.env.VITE_GITHUB_TOKEN || ''
const SESSION_KEY = 'cms_auth'

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
      pendingUploads: []
    }
  },

  computed: {
    isReviewsTab() {
      return this.activeTab === 'reviews'
    },
    currentProducts() {
      return this.products[this.activeTab] || []
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
          uploadEntry.status = 'конвертация...'
          const base64 = await fileToBase64(file)
          const objectUrl = URL.createObjectURL(file)
          product._photos.push({ filename: file.name, url: objectUrl, isNew: true, base64, file })
          uploadEntry.status = 'готово к сохранению'
        } catch (e) {
          uploadEntry.status = 'ошибка: ' + e.message
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
              if (entry) entry.status = 'загрузка...'
              const repoPath = `src/img/products/${category}/${product.slug}/${photo.filename}`
              await this.api.uploadFile(repoPath, photo.base64, `CMS: upload ${photo.filename}`)
              photo.isNew = false
              delete photo.base64
              delete photo.file
              if (entry) entry.status = 'загружено'
            }

            // 2. Delete removed images
            for (const filename of product._deletedPhotos || []) {
              const repoPath = `src/img/products/${category}/${product.slug}/${filename}`
              await this.api.deleteFile(repoPath, `CMS: delete ${filename}`)
            }
            product._deletedPhotos = []
          }
        }

        // 3. Build and push products.json
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
        await this.api.updateProductsJson(updatedProducts)

        // 4. Push reviews.json
        const updatedReviews = this.reviews.map(r => ({
          id: r.id,
          author: r.author,
          company: r.company,
          text: r.text,
          date: r.date,
          rating: r.rating
        }))
        await this.api.updateReviewsJson(updatedReviews)

        this.pendingUploads = []
        this.saveStatus = { type: 'success', message: 'Сохранено! Деплой запущен, изменения появятся через ~2 минуты.' }
      } catch (e) {
        this.saveStatus = { type: 'error', message: 'Ошибка: ' + e.message }
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
  justify-content: flex-end;
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
</style>
