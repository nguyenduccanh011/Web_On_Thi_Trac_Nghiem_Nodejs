<template>
  <div id="app">
    <AppHeader />
    <div class="main-content">
      <div class="sidebar">
        <AppSidebar />
      </div>
      <div class="content">
        <router-view />
      </div>
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
  margin-top: 70px;
  position: relative;
  width: 100%;
}

.sidebar {
  width: 260px;
  background-color: #2c3e50;
  padding: 20px;
  position: fixed;
  top: 70px;
  left: 0;
  height: calc(100vh - 70px - 40px); /* Trừ chiều cao của header và footer */
  overflow-y: auto;
  z-index: 1; /* Đảm bảo sidebar nằm dưới header và footer */
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #ecf0f1;
  margin-left: 260px;
  min-height: calc(100vh - 70px - 40px); /* Trừ chiều cao của header và footer */
  width: calc(100% - 260px);
  position: relative;
  z-index: 0; /* Đảm bảo content nằm dưới sidebar */
  box-sizing: border-box;
}

header {
  z-index: 2; /* Đảm bảo header nằm trên sidebar */
}

footer {
  z-index: 2; /* Đảm bảo footer nằm trên sidebar */
}

/* Responsive design cho màn hình nhỏ */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    height: auto;
    z-index: 1;
  }
  .content {
    margin-left: 0;
    width: 100%;
  }
}
</style>