<template>
  <div id="app">
    <template v-if="!isAdmin">
      <AppHeader />
      <router-view />
      <AppFooter />
      <FeedbackModal :open="showFeedbackModal" @close="showFeedbackModal = false" />
    </template>
    <router-view v-else />
  </div>
</template>

<script>
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import FeedbackModal from './components/FeedbackModal.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    FeedbackModal
  },
  setup() {
    const route = useRoute()
    const showFeedbackModal = ref(false)
    const isAdmin = computed(() => route.path === '/admin')
    provide('openFeedbackModal', () => {
      showFeedbackModal.value = true
    })
    return { showFeedbackModal, isAdmin }
  }
}
</script>

<style>
:root {
  --primary-color: #722f37;
  --primary-dark: #5a2330;
  --primary-light: #8b3d47;
  --text-dark: #2c2c2c;
  --text-light: #666666;
  --background: #ffffff;
  --border: #e5e5e5;
  --shadow: rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  overflow-x: hidden;
  width: 100%;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 20px;
  color: var(--text-dark);
  background-color: var(--background);
  line-height: 1.6;
  overflow-x: hidden;
  width: 100%;
  min-width: 0;
}

#app {
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
}


.container {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 28px;
  min-width: 0;
}

.container-wide {
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  min-width: 0;
}

.btn {
  display: inline-block;
  padding: 16px 32px;
  min-height: 48px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

@media (max-width: 768px) {
  body {
    font-size: 16px;
  }

  .container {
    padding-left: max(16px, env(safe-area-inset-left, 0));
    padding-right: max(16px, env(safe-area-inset-right, 0));
  }

  .container-wide {
    padding-left: max(16px, env(safe-area-inset-left, 0));
    padding-right: max(16px, env(safe-area-inset-right, 0));
  }

  .btn {
    padding: 14px 24px;
    min-height: 48px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding-left: max(12px, env(safe-area-inset-left, 0));
    padding-right: max(12px, env(safe-area-inset-right, 0));
  }

  .container-wide {
    padding-left: max(12px, env(safe-area-inset-left, 0));
    padding-right: max(12px, env(safe-area-inset-right, 0));
  }
}

.btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(114, 47, 55, 0.3);
}
</style>
