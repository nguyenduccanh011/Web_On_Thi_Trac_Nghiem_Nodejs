import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Import router

createApp(App)
  .use(router) // Sử dụng router
  .mount('#app')
