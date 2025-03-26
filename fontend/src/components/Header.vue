<template>
  <header class="top-nav">
    <div class="logo">
      <router-link to="/">QLTSGeek</router-link>
    </div>

    <div class="search-bar">
      <i class="fas fa-search"></i> 
      <input type="text" placeholder="Tìm kiếm bài kiểm tra, chủ đề...">
    </div>

    <div class="user-info" ref="userInfo" @click.stop="toggleDropdown">
      <img :src="getProfilePictureUrl(userInfo?.profile_picture)" alt="Avatar" class="avatar">
      <div class="user-details">
        <span>{{ userInfo ? userInfo.username : 'Chưa đăng nhập' }}</span>
        <span class="role">{{ userInfo ? userInfo.role : 'Khách' }}</span>
      </div>
      <div class="user-dropdown" v-show="showDropdown">
        <router-link to="/profile" class="dropdown-item" @click="handleNavigation('/profile')">
          <i class="fas fa-user"></i> Hồ sơ
        </router-link>
        <router-link to="/settings" class="dropdown-item" @click="handleNavigation('/settings')">
          <i class="fas fa-cog"></i> Cài đặt
        </router-link>
        <a href="#" @click.prevent="handleLogout" class="dropdown-item">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </a>
      </div>

      <div class="user-dropdown" v-show="showDropdown && !isLoggedIn">
        <router-link to="/login" class="dropdown-item" @click.stop="handleNavigation('/login')">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập
        </router-link>
        <router-link to="/register" class="dropdown-item" @click.stop="handleNavigation('/register')">
          <i class="fas fa-user-plus"></i> Đăng ký
        </router-link>
      </div>
    </div>
  </header>

</template>
  <!-- Script -->
<script>
import eventBus from '../eventBus';
import authService from '../services/auth.service';

const API_URL = 'http://localhost:3000/api';

export default {
  name: 'AppHeader',
  data() {
    return {
      isLoggedIn: false,
      userInfo: null,
      showDropdown: false
    };
  },
  created() {
    this.checkLoginStatus();
    eventBus.on('login-success', (user) => {
      this.isLoggedIn = true;
      this.userInfo = user;
    });
  },
  mounted() {
    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    eventBus.off('login-success');
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    checkLoginStatus() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const user = localStorage.getItem('user');
      
      if (isLoggedIn && user) {
        this.isLoggedIn = true;
        this.userInfo = JSON.parse(user);
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    handleClickOutside(event) {
      if (this.$refs.userInfo && !this.$refs.userInfo.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    handleNavigation(path) {
      this.showDropdown = false;
      this.$router.push(path);
    },
    handleProfileClick() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!isLoggedIn || !token || !user) {
        this.$router.push('/login');
        return;
      }

      this.showDropdown = false;
      this.$router.push('/profile');
    },
    handleLogout() {
      authService.logout();
      this.isLoggedIn = false;
      this.userInfo = null;
      this.showDropdown = false;
      this.$router.push('/login');
    },
    getProfilePictureUrl(profilePicture) {
      if (!profilePicture) {
        return '/default-avatar.png';
      }
      return `${API_URL.replace('/api', '')}${profilePicture}`;
    }
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
  display: block;
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

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item i {
  margin-right: 0.5rem;
  width: 20px;
  text-align: center;
}
</style>