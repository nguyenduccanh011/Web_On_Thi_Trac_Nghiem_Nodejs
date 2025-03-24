<template>
  <div class="login">
    <div class="form-container">
      <h2>Đăng nhập</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username"><i class="fas fa-user"></i> Username:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password"><i class="fas fa-lock"></i> Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Đăng nhập</button>
        <div v-if="loginError" class="error-message">{{ loginError }}</div>
        <div class="register-link">
          <p>Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth.service';
import eventBus from '../eventBus';

export default {
  data() {
    return {
      username: '',
      password: '',
      loginError: ''
    };
  },
  methods: {
    async handleSubmit() {
      this.loginError = '';
      try {
        const response = await authService.login({
          username: this.username,
          password: this.password,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isLoggedIn', 'true');
        eventBus.emit('login-success', response.data.user);
        this.$router.push('/');
      } catch (error) {
        this.loginError = error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập";
      }
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ecf0f1;
}

.form-container {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: #2c3e50;
}

label i {
  margin-right: 10px;
  color: #3498db;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #3498db;
  outline: none;
}

button {
  width: 100%;
  background-color: #3498db;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.register-link {
  margin-top: 15px;
  text-align: center;
  color: #2c3e50;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }
  input[type="text"],
  input[type="password"] {
    padding: 8px;
  }
}
</style>