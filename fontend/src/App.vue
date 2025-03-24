<template>
  <div id="app">
    <AppHeader />
    <div class="main-content">
      <div class="sidebar">
        <AppSidebar />
      </div>
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/Header.vue';
import AppFooter from './components/Footer.vue';
import AppSidebar from './components/Sidebar.vue';
import './assets/main.css'; // Import main.css

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppSidebar
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px; /* Chiều rộng cố định cho sidebar */
  background-color: #2c3e50; /* Màu nền sidebar */
  padding: 20px; /* Khoảng cách bên trong */
}

router-view {
  flex: 1; /* Chiếm phần còn lại của không gian */
  padding: 20px;
  background-color: #ecf0f1; /* Màu nền nội dung chính */
}

/* Responsive design cho màn hình nhỏ */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column; /* Chuyển sang bố cục dọc */
  }
  .sidebar {
    width: 100%; /* Sidebar chiếm toàn bộ chiều rộng */
  }
}
</style>