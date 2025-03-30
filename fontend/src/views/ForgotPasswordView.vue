<template>
  <div class="forgot-password">
    <div class="form-container">
      <h2>Quên mật khẩu</h2>
      <p class="description">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email"><i class="fas fa-envelope"></i> Email:</label>
          <input type="email" id="email" v-model="email" required>
          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>
        </div>
        <button type="submit">Gửi yêu cầu</button>
        <div class="back-to-login">
          <router-link to="/login"><i class="fas fa-arrow-left"></i> Quay lại đăng nhập</router-link>

        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth.service';

export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      email: '',
      error: '',
      success: ''
    };
  },

  methods: {
    async handleSubmit() {
      this.error = '';
      this.success = '';
      try {
        await authService.forgotPassword(this.email);
        this.success = 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu';
      } catch (error) {
        this.error = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại';

      }
    }
  }
};
</script>

<style scoped>
.forgot-password {
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
  margin-bottom: 10px;
  color: #2c3e50;
}

.description {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 20px;
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

input[type="email"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input[type="email"]:focus {
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
  color: #e74c3c;
  margin-top: 5px;
  text-align: center;

}

.success-message {
  color: #27ae60;
  margin-top: 5px;
  text-align: center;
}

.back-to-login {

  margin-top: 15px;
  text-align: center;
}

.back-to-login a {
  color: #3498db;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.back-to-login a i {
  margin-right: 5px;
}

.back-to-login a:hover {

  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }

  input[type="email"] {
    padding: 8px;
  }
}
</style> 