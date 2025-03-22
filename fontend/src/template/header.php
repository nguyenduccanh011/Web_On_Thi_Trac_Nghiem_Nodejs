<template>
  <header class="top-nav">
    <div class="logo">
      <router-link to="/">QLTSGeek</router-link>
    </div>

    <div class="search-bar">
      <i class="fas fa-search"></i> 
      <input type="text" placeholder="Tìm kiếm bài kiểm tra, chủ đề...">
    </div>

    <div class="user-info">
      <img src="https://photo.znews.vn/w1200/Uploaded/mdf_eioxrd/2021_07_06/1q.jpg" alt="Avatar" class="avatar">
      <div class="user-details">
        <span>Sanket Pal</span>
        <span class="role">Student</span>
      </div>
      <div class="user-dropdown">
        <router-link to="/profile"><i class="fas fa-user"></i> Hồ sơ</router-link>
        <router-link to="/settings"><i class="fas fa-cog"></i> Cài đặt</router-link>
        <router-link to="/logout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
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
}

.search-bar input {
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
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
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
  z-index: 200;
}

.user-info:hover .user-dropdown {
  display: block;
}

.user-dropdown a {
  display: block;
  padding: 10px 15px;
  color: #444;
  text-decoration: none;
}

.user-dropdown a:hover {
  background-color: #f0f0f0;
}
</style>