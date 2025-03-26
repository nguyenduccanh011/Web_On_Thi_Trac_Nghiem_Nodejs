<template>
  <div class="reset-password">
    <div class="form-container">
      <h2>Đặt lại mật khẩu</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="password"><i class="fas fa-lock"></i> Mật khẩu mới:</label>
          <input type="password" id="password" v-model="password" required>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>
        <div class="form-group">
          <label for="confirmPassword"><i class="fas fa-lock"></i> Xác nhận mật khẩu:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>
        <button type="submit">Đặt lại mật khẩu</button>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
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
  name: 'ResetPasswordView',
  data() {
    return {
      password: '',
      confirmPassword: '',
      error: '',
      success: '',
      passwordError: '',
      errors: {}
    };
  },
  created() {
    // Lấy token từ URL
    const token = this.$route.query.token;
    if (!token) {
      this.error = 'Token không hợp lệ hoặc đã hết hạn';
      setTimeout(() => {
        this.$router.push('/login');
      }, 3000);
    }
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.success = '';
      this.passwordError = '';
      this.errors = {};

      // Kiểm tra mật khẩu
      if (this.password !== this.confirmPassword) {
        this.passwordError = 'Mật khẩu xác nhận không khớp';
        return;
      }

      // Kiểm tra độ dài mật khẩu
      if (this.password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        return;
      }

      try {
        const token = this.$route.query.token;
        console.log('Token from URL:', token); // Log để debug

        if (!token) {
          this.error = 'Token không hợp lệ hoặc đã hết hạn';
          setTimeout(() => {
            this.$router.push('/login');
          }, 3000);
          return;
        }

        console.log('Sending reset password request...'); // Log để debug
        await authService.resetPassword(token, this.password);
        console.log('Reset password successful'); // Log để debug
        this.success = 'Mật khẩu đã được đặt lại thành công!';
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);
      } catch (error) {
        console.error('Reset password error:', error);
        console.error('Error response:', error.response); // Log để debug
        this.error = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại';
        if (error.response?.data?.message === 'Token đã hết hạn' || 
            error.response?.data?.message === 'Token không hợp lệ' ||
            error.response?.data?.message === 'Token không hợp lệ hoặc đã hết hạn') {
          setTimeout(() => {
            this.$router.push('/login');
          }, 3000);
        }
      }
    }
  }
};
</script>

<style scoped>
.reset-password {
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

input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

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
  input[type="password"] {
    padding: 8px;
  }
}
</style> 