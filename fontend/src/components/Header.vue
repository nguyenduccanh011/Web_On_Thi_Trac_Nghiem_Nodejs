<template>
  <header class="top-nav">
    <div class="logo">
      <router-link to="/">QLTSGeek</router-link>
    </div>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />


    <div class="search-bar">
      <i class="fas fa-search"></i> 
      <input type="text" placeholder="Tìm kiếm bài kiểm tra, chủ đề...">
    </div>

    <div class="user-info" ref="userInfo">
      <img :src="userInfo ? userInfo.avatar : 'https://photo.znews.vn/w1200/Uploaded/mdf_eioxrd/2021_07_06/1q.jpg'" alt="Avatar" class="avatar">
      <div class="user-details">
        <span>{{ userInfo ? userInfo.username : 'Chưa đăng nhập' }}</span>
        <span class="role">{{ userInfo ? userInfo.role : 'Khách' }}</span>
      </div>
      <div class="user-dropdown" v-if="isLoggedIn">
        <router-link to="/profile"><i class="fas fa-user"></i> Hồ sơ</router-link>
        <router-link to="/settings"><i class="fas fa-cog"></i> Cài đặt</router-link>
        <a href="#" @click.prevent="handleLogout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
      </div>

      <div class="user-dropdown" v-else>
        <router-link to="/login"><i class="fas fa-sign-in-alt"></i> Đăng nhập</router-link>
        <router-link to="/register"><i class="fas fa-user-plus"></i> Đăng ký</router-link>
      </div>
    </div>
  </header>

</template>
  <!-- Script -->
<script>
import eventBus from '../eventBus';

export default {
  name: 'AppHeader',
  data() {
    return {
      isLoggedIn: false,
      userInfo: null
    };
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      this.isLoggedIn = false;
      this.userInfo = null;
      this.$router.push('/login');
    },
    updateUserInfo() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.userInfo = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user info:', e);
        }
      }
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
  },
  mounted() {
    this.updateUserInfo();
    // Lắng nghe sự kiện đăng nhập thành công
    eventBus.on('login-success', (user) => {
      this.userInfo = user;
      this.isLoggedIn = true;
    });
  },
  beforeUnmount() {
    // Xóa event listener khi component bị hủy
    eventBus.off('login-success');
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.logo {
  flex-shrink: 0;
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.logo a {
  text-decoration: none;
  color: #2e86c1;
  font-weight: 700;
  font-size: 1.8em;
  letter-spacing: 1px;
}

.search-bar {
  display: flex;
  align-items: center;
  flex-grow: 2;
  justify-content: center;
  flex-basis: 50%; /* Mở rộng ô tìm kiếm */
}

.search-bar input {
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  border: none; /* Loại bỏ viền */
  outline: none; /* Loại bỏ viền khi focus */
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  flex-grow: 1;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-info .user-details {
  display: flex;
  flex-direction: column;
  margin-right: 15px;
  text-align: right;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info span {
  margin-right: 5px;
  font-size: 1em;
  color: #444;
}

.user-info .role {
  font-size: 0.85em;
  color: #777;
}

.user-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
  z-index: 200;
  min-width: 150px;
  max-width: 200px;
  animation: fadeIn 0.2s ease-in-out;
}

.user-info:hover .user-dropdown {
  display: block;
}

.user-dropdown a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #444;
  text-decoration: none;
  transition: all 0.2s;
}

.user-dropdown a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.user-dropdown a:hover {
  background-color: #f0f0f0;
  color: #2e86c1;
}

.search-bar {
  border: 2px solid #d0d3d4;
  border-radius: 30px;
  padding: 8px 15px;
  transition: border-color 0.3s;
}

.search-bar:focus-within {
  border-color: #2e86c1;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(-5px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
</style>