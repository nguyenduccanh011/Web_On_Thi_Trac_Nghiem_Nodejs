<template>
  <div class="register">
    <div class="form-container">
      <h2>Đăng ký</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username"><i class="fas fa-user"></i> Username:</label>
          <input type="text" id="username" v-model="username" required>
          <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
        </div>
        <div class="form-group">
          <label for="email"><i class="fas fa-envelope"></i> Email:</label>
          <input type="email" id="email" v-model="email" required>
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>
        <div class="form-group">
          <label for="password"><i class="fas fa-lock"></i> Password:</label>
          <input type="password" id="password" v-model="password" required>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>
        <div class="form-group">
          <label for="confirmPassword"><i class="fas fa-lock"></i> Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>
        <button type="submit">Đăng ký</button>
        <div v-if="registrationError" class="error-message">{{ registrationError }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth.service';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordError: '',
      registrationError: '',
      errors: {}
    };
  },
  methods: {
    async handleSubmit() {
      this.passwordError = '';
      this.registrationError = '';
      this.errors = {};
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
        this.$router.push('/login');
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors.reduce((acc, err) => {
            acc[err.param] = err.msg;
            return acc;
          }, {});
        } else if (error.response?.data?.message) {
          this.registrationError = error.response.data.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.register {
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
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus,
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
  margin-top: 5px;
}

@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    padding: 8px;
  }
}
</style>