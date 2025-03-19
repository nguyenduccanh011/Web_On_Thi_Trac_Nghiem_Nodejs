<template>
    <div class="register">
      <h2>Register</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
           <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>
        <button type="submit">Register</button>
         <div v-if="registrationError" class="error-message">{{ registrationError }}</div>
      </form>
    </div>
  </template>
  
  <script>
  import authService from '../services/auth.service';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        passwordError: '',
        registrationError: ''
      };
    },
    methods: {
      async handleSubmit() {
          this.passwordError = ''; //reset lỗi
          this.registrationError = '';
        if (this.password !== this.confirmPassword) {
          this.passwordError = 'Passwords do not match';
          return;
        }
  
        try {
          await authService.register({
            username: this.username,
            email: this.email,
            password: this.password,
          });
          // Chuyển hướng đến trang login sau khi đăng ký thành công
          this.$router.push('/login');  // Đảm bảo bạn đã định nghĩa route '/login'
        } catch (error) {
           if (error.response && error.response.data && error.response.data.message) {
               this.registrationError = error.response.data.message; // Hiển thị lỗi từ backend
           }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .error-message {
     color: red;
    margin-top: 5px;
  }
  </style>