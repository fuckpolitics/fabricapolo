<template>
  <div class="product-gallery">
    <div class="main-image-container">
      <img 
        :src="currentImage" 
        :alt="'Product image ' + (currentIndex + 1)"
        class="main-image"
        @error="handleImageError"
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
      currentIndex: 0
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
      // Заменяем битое изображение на placeholder
      event.target.src = `https://picsum.photos/seed/placeholder-${Date.now()}/400/500`
    },
    handleThumbnailError(event) {
      event.target.src = `https://picsum.photos/seed/thumb-${Date.now()}/80/80`
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

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  .main-image-container {
    height: 400px;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .thumbnails {
    padding: 8px;
    gap: 6px;
  }
  
  .thumbnail {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 480px) {
  .main-image-container {
    height: 300px;
  }
  
  .nav-button {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
  
  .thumbnail {
    width: 45px;
    height: 45px;
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
