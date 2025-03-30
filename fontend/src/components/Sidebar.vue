<template>
    <aside class="sidebar">
      <nav>
        <ul>
          <li><router-link to="/"><i class="fas fa-tachometer-alt"></i> Trang chủ</router-link></li>
          <li><router-link to="/create-question"><i class="fas fa-book"></i> Tạo câu hỏi mới</router-link></li>
          <li><router-link to="/create-category"><i class="fas fa-stethoscope"></i> Tạo danh mục mới</router-link></li>
          <li><router-link to="/leaderboard"><i class="fas fa-clipboard-list"></i> Cheat Sheet</router-link></li>
          <li><router-link to="/forum"><i class="fas fa-users"></i> OLTS Social</router-link></li>
          <li><router-link to="/support"><i class="fas fa-chalkboard-teacher"></i> Tutor Support</router-link></li>
          <li><router-link to="/criteria"><i class="fas fa-check-circle"></i> Eligibility Criteria</router-link></li>
          <li><router-link to="/help"><i class="fas fa-question-circle"></i> Help</router-link></li>
          <li><router-link to="/settings"><i class="fas fa-cogs"></i> Setting</router-link></li>
          <li><router-link to="/support"><i class="fas fa-headset"></i> Support</router-link></li>
          <li><router-link to="/library"><i class="fas fa-book-open"></i> Library</router-link></li>
          <li><router-link to="/messages"><i class="fas fa-envelope"></i> Message</router-link></li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'AppSidebar'
  };
  </script>
  
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
  
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
  
  /* Responsive design */
  @media (max-width: 992px) {
    .sidebar {
      width: 80px;
    }
  
    .sidebar nav li a span {
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
  
    .sidebar nav li a span {
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