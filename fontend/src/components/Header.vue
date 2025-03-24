<template>
  <header class="top-nav">
    <div class="logo">
      <router-link to="/">QLTSGeek</router-link>
    </div>

    <div class="search-bar">
      <i class="fas fa-search"></i> 
      <input type="text" placeholder="Tìm kiếm bài kiểm tra, chủ đề...">
    </div>

    <div class="user-info" @click="toggleDropdown" ref="userInfo">
      <img src="https://photo.znews.vn/w1200/Uploaded/mdf_eioxrd/2021_07_06/1q.jpg" alt="Avatar" class="avatar">
      <div class="user-details">
        <span>{{ isLoggedIn ? 'Sanket Pal' : 'Chưa đăng nhập' }}</span>
        <span class="role">{{ isLoggedIn ? 'Student' : 'Khách' }}</span>
      </div>
      <div class="user-dropdown" v-show="isDropdownVisible && isLoggedIn" ref="dropdown">
        <router-link to="/profile"><i class="fas fa-user"></i> Hồ sơ</router-link>
        <router-link to="/settings"><i class="fas fa-cog"></i> Cài đặt</router-link>
        <router-link to="/logout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      isDropdownVisible: false,
      isLoggedIn: false
    };
  },
  methods: {
    toggleDropdown() {
      if (!this.isLoggedIn) {
        this.$router.push('/register');
        return;
      }
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    handleClickOutside(event) {
      if (this.$refs.userInfo && !this.$refs.userInfo.contains(event.target)) {
        this.isDropdownVisible = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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
  display: flex;
  justify-content: center;
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

.user-dropdown a {
  display: block;
  padding: 10px 15px;
  color: #444;
  text-decoration: none;
}

.user-dropdown a:hover {
  background-color: #e8f0fe;
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

.user-dropdown a:hover {
  background-color: #e8f0fe;
  color: #2e86c1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>