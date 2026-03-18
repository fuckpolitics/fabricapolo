<template>
  <div class="product-gallery">
    <div
      class="main-image-container"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <img 
        :src="currentImage" 
        :alt="'Product image ' + (currentIndex + 1)"
        class="main-image"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
        decoding="async"
        @error="handleImageError"
        draggable="false"
      />
      
      <button 
        v-if="images.length > 1"
        @click="previousImage"
        class="nav-button prev"
        aria-label="Previous image"
      >
        ‹
      </button>
      
      <button 
        v-if="images.length > 1"
        @click="nextImage"
        class="nav-button next"
        aria-label="Next image"
      >
        ›
      </button>
    </div>
    
    <div v-if="images.length > 1" class="thumbnails">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="setCurrentImage(index)"
        class="thumbnail"
        :class="{ active: index === currentIndex }"
      >
        <img 
          :src="image" 
          :alt="'Thumbnail ' + (index + 1)"
          :loading="priority && index === 0 ? 'eager' : 'lazy'"
          decoding="async"
          @error="handleThumbnailError"
        />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductGallery',
  props: {
    images: {
      type: Array,
      required: true,
      validator: (value) => value.length > 0
    },
    priority: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplayIntervalMs: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      currentIndex: 0,
      touchStartX: 0,
      touchEndX: 0,
      // Inline placeholder (работает после деплоя без внешних запросов)
      placeholderImage: 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect fill="#e8e8e8" width="400" height="500"/><text x="50%" y="50%" fill="#999" font-family="sans-serif" font-size="18" text-anchor="middle" dy=".3em">Нет изображения</text></svg>'
      ),
      placeholderThumb: 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="#e8e8e8" width="80" height="80"/><text x="50%" y="50%" fill="#999" font-family="sans-serif" font-size="10" text-anchor="middle" dy=".3em">—</text></svg>'
      )
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex]
    }
  },
  methods: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length
    },
    previousImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    },
    setCurrentImage(index) {
      this.currentIndex = index
    },
    handleImageError(event) {
      event.target.src = this.placeholderImage
    },
    handleThumbnailError(event) {
      event.target.src = this.placeholderThumb
    },
    onTouchStart(e) {
      if (this.images.length <= 1) return
      this.touchStartX = e.touches ? e.touches[0].clientX : e.clientX
    },
    onTouchMove(e) {
      if (e.touches) this.touchEndX = e.touches[0].clientX
    },
    onTouchEnd(e) {
      if (this.images.length <= 1) return
      const endX = e.changedTouches ? e.changedTouches[0].clientX : (e.clientX ?? this.touchEndX)
      const diff = this.touchStartX - endX
      const minSwipe = 50
      if (diff > minSwipe) this.nextImage()
      else if (diff < -minSwipe) this.previousImage()
    }
  },
  mounted() {
    // Автоматическое переключение изображений каждые 3 секунды
    if (this.autoplay && this.images.length > 1) {
      this.interval = setInterval(() => {
        this.nextImage()
      }, this.autoplayIntervalMs)
    }
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}
</script>

<style scoped>
.product-gallery {
  position: relative;
  background: #f8f8f8;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.main-image-container {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  touch-action: pan-y;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: translateY(-50%) scale(1.1);
}

.nav-button.prev {
  left: 10px;
}

.nav-button.next {
  right: 10px;
}

.thumbnails {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: white;
  border-top: 1px solid var(--border);
  overflow-x: auto;
}

.thumbnail {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f8f8;
}

.thumbnail:hover {
  border-color: var(--primary-light);
}

.thumbnail.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(114, 47, 55, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Стили для мобильных устройств (touch targets min 44px) */
@media (max-width: 768px) {
  .main-image-container {
    height: 400px;
  }

  .nav-button {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    font-size: 22px;
    -webkit-tap-highlight-color: transparent;
  }

  .thumbnails {
    padding: 10px 8px;
    gap: 6px;
    -webkit-overflow-scrolling: touch;
  }

  .thumbnail {
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
    -webkit-tap-highlight-color: transparent;
  }
}

@media (max-width: 480px) {
  .main-image-container {
    height: 280px;
  }

  .nav-button.prev {
    left: 6px;
  }

  .nav-button.next {
    right: 6px;
  }

  .nav-button {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    font-size: 20px;
  }

  .thumbnail {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
  }
}

/* Анимация загрузки */
.main-image {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
