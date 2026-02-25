<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
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

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 20px;
  color: var(--text-dark);
  background-color: var(--background);
  line-height: 1.6;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 28px;
}

.container-wide {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 16px;
}

.btn {
  display: inline-block;
  padding: 16px 32px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(114, 47, 55, 0.3);
}
</style>
