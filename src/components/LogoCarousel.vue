<template>
  <div class="carousel">
    <div class="carousel-top">
      <div class="title">Производим продукцию для</div>
      <div class="controls">
        <button class="control" @click="scrollLeft" aria-label="Scroll left">‹</button>
        <button class="control" @click="scrollRight" aria-label="Scroll right">›</button>
      </div>
    </div>

    <div ref="track" class="track" role="region" aria-label="Company logos">
      <div v-for="logo in logos" :key="logo.name" class="logo-card">
        <img class="logo" :src="logo.src" :alt="logo.name" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoCarousel',
  props: {
    logos: {
      type: Array,
      required: true,
      validator: (v) => Array.isArray(v) && v.length > 0
    }
  },
  methods: {
    scrollLeft() {
      const el = this.$refs.track
      if (!el) return
      el.scrollBy({ left: -520, behavior: 'smooth' })
    },
    scrollRight() {
      const el = this.$refs.track
      if (!el) return
      el.scrollBy({ left: 520, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.carousel {
  width: 100%;
}

.carousel-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.title {
  font-size: 34px;
  font-weight: 800;
  color: var(--text-dark);
  letter-spacing: -0.02em;
}

.controls {
  display: flex;
  gap: 10px;
}

.control {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(114, 47, 55, 0.22);
  background: #fff;
  color: var(--primary-color);
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.control:hover {
  background: rgba(114, 47, 55, 0.06);
  transform: scale(1.04);
}

.track {
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 8px 4px 18px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.track::-webkit-scrollbar {
  height: 10px;
}

.track::-webkit-scrollbar-thumb {
  background: rgba(114, 47, 55, 0.25);
  border-radius: 999px;
}

.logo-card {
  scroll-snap-align: start;
  flex: 0 0 auto;
  width: 220px;
  height: 110px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
}

.logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.9;
  transition: filter 0.2s ease, opacity 0.2s ease;
}

.logo-card:hover .logo {
  filter: grayscale(0);
  opacity: 1;
}

@media (max-width: 768px) {
  .carousel-top {
    margin-bottom: 12px;
  }

  .title {
    font-size: 26px;
  }

  .logo-card {
    width: 180px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .carousel-top {
    flex-wrap: wrap;
    gap: 12px;
  }

  .title {
    font-size: 20px;
    flex: 1 1 100%;
  }

  .controls {
    margin-left: auto;
  }

  .logo-card {
    width: 160px;
    height: 90px;
    padding: 10px;
  }

  .track {
    gap: 12px;
    padding: 6px 4px 14px;
  }
}
</style>
