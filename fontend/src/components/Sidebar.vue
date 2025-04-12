<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <!-- Menu chung cho tất cả người dùng -->
        <li>
          <router-link to="/">
            <i class="fas fa-home"></i> Trang chủ
          </router-link>
        </li>
        <li>
          <router-link to="/exams/select">
            <i class="fas fa-clipboard-list"></i> Thi thử
          </router-link>
        </li>
        <li>
          <router-link to="/exam-attempt">
            <i class="fas fa-history"></i> Lịch sử thi
          </router-link>
        </li>

        <!-- Menu chỉ dành cho admin -->
        <template v-if="isAdmin">
          <li class="menu-divider">
            <span>Quản lý</span>
          </li>
          <li>
            <router-link to="/create-question">
              <i class="fas fa-plus-circle"></i> Tạo câu hỏi
            </router-link>
          </li>
          <li>
            <router-link to="/create-exam">
              <i class="fas fa-file-alt"></i> Tạo đề thi
            </router-link>
          </li>
        </template>

        <!-- Menu cài đặt -->
        <li class="menu-divider">
          <span>Cài đặt</span>
        </li>
        <li>
          <router-link to="/profile">
            <i class="fas fa-user"></i> Hồ sơ
          </router-link>
        </li>
        <li>
          <router-link to="/settings">
            <i class="fas fa-cog"></i> Cài đặt
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: "AppSidebar",
  computed: {
    isAdmin() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('User role:', user.role); // Thêm log để debug
        return user.role === 'admin';
      } catch (error) {
        console.error('Error parsing user data:', error);
        return false;
      }
    }
  }
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

.sidebar {
  width: 260px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding-top: 30px;
  transition: width 0.3s ease;
  position: fixed;
  top: 70px;
  height: calc(100vh - 70px);
  overflow-y: auto;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar nav li {
  margin-bottom: 5px;
}

.sidebar nav li a {
  display: flex;
  align-items: center;
  padding: 12px 25px;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  font-size: 0.95em;
}

.sidebar nav li a:hover,
.sidebar nav li a.router-link-active {
  background-color: #34495e;
  color: #fff;
  border-left-color: #3498db;
  padding-left: 22px;
}

.sidebar nav li a i {
  margin-right: 15px;
  width: 24px;
  text-align: center;
  font-size: 1.2em;
  color: #bdc3c7;
}

.sidebar nav li a:hover i,
.sidebar nav li a.router-link-active i {
  color: #3498db;
}

.menu-divider {
  padding: 10px 25px;
  color: #95a5a6;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 15px;
  border-top: 1px solid #34495e;
}

.menu-divider:first-child {
  border-top: none;
  margin-top: 0;
}

/* Responsive design */
@media (max-width: 992px) {
  .sidebar {
    width: 80px;
  }

  .sidebar nav li a span,
  .sidebar nav li.menu-divider {
    display: none;
  }

  .sidebar nav li a i {
    margin-right: 0;
    font-size: 1.4em;
  }

  .sidebar nav li a {
    padding: 15px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    padding-top: 15px;
    position: relative;
    top: 0;
    height: auto;
    background-color: #34495e;
  }

  .sidebar nav li a span,
  .sidebar nav li.menu-divider {
    display: inline;
  }

  .sidebar nav li a i {
    margin-right: 10px;
  }

  .sidebar nav ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0 10px;
  }

  .sidebar nav li {
    margin: 5px;
  }

  .sidebar nav li a {
    padding: 8px 15px;
    border-radius: 4px;
    border-left: none;
  }

  .sidebar nav li a:hover,
  .sidebar nav li a.router-link-active {
    background-color: #2c3e50;
    padding-left: 15px;
  }
}
</style>
