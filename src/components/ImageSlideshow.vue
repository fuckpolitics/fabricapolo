<template>
  <div class="slideshow">
    <div class="frame">
      <img class="image" :src="currentImage" :alt="altText" />

      <button v-if="images.length > 1" class="nav prev" @click="prev" aria-label="Previous">
        ‹
      </button>
      <button v-if="images.length > 1" class="nav next" @click="next" aria-label="Next">
        ›
      </button>
    </div>

    <div v-if="images.length > 1" class="dots">
      <button
        v-for="(_, idx) in images"
        :key="idx"
        class="dot"
        :class="{ active: idx === currentIndex }"
        @click="set(idx)"
        :aria-label="'Go to slide ' + (idx + 1)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSlideshow',
  props: {
    images: {
      type: Array,
      required: true,
      validator: (v) => Array.isArray(v) && v.length > 0
    },
    alt: {
      type: String,
      default: 'Slide'
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
    },
    altText() {
      return `${this.alt} ${this.currentIndex + 1}`
    }
  },
  methods: {
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    },
    set(idx) {
      this.currentIndex = idx
    }
  }
}
</script>

<style scoped>
.slideshow {
  width: 100%;
}

.frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: #f6f6f6;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
}

.image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 26px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.nav:hover {
  background: rgba(0, 0, 0, 0.72);
  transform: translateY(-50%) scale(1.04);
}

.prev {
  left: 14px;
}

.next {
  right: 14px;
}

.dots {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  justify-content: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  background: rgba(114, 47, 55, 0.25);
  cursor: pointer;
}

.dot.active {
  background: var(--primary-color);
}
</style>
