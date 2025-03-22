<template>
    <aside>
      <ul>
        <li><router-link to="/"><i class="fas fa-home"></i> Home</router-link></li>
        <li><router-link to="/exams"><i class="fas fa-book"></i> Exams</router-link></li>
        <li><router-link to="/history"><i class="fas fa-history"></i> History</router-link></li>
        <li><router-link to="/leaderboard"><i class="fas fa-trophy"></i> Leaderboard</router-link></li>
        <li><router-link to="/forum"><i class="fas fa-comments"></i> Forum</router-link></li>
      </ul>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'AppSidebar'
  };
  </script>
  
  <style scoped>
  aside {
    background-color: #2c3e50;
    padding: 15px;
    height: 100%;
  }
  
  aside ul {
    list-style: none;
    padding: 0;
  }
  
  aside ul li {
    margin-bottom: 10px;
  }
  
  aside ul li a {
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center;
  }
  
  aside ul li a i {
    margin-right: 10px;
  }
  
  aside ul li a:hover {
    text-decoration: underline;
  }
  </style>