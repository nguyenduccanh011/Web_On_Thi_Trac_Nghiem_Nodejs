<template>
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/exams">Exams</router-link></li>
          <li><router-link to="/forum">Forum</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/register">Register</router-link></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'AppHeader'
  };
  </script>
  
  <style scoped>
  header {
    background-color: #2c3e50;
    color: white;
    padding: 10px 0;
  }
  
  nav ul {
    list-style: none;
    display: flex;
    justify-content: space-around;
  }
  
  nav ul li {
    margin: 0 10px;
  }
  
  nav ul li a {
    color: white;
    text-decoration: none;
  }
  
  nav ul li a:hover {
    text-decoration: underline;
  }
  </style>