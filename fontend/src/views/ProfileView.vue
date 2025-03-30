<template>
  <div class="profile-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải thông tin...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="user" class="profile-content">
      <h1>Thông tin cá nhân</h1>
      
      <div class="profile-section">
        <div class="avatar-section">
          <img :src="getProfilePictureUrl(user.profile_picture)" alt="Avatar" class="avatar">
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            style="display: none" 
            @change="handleFileChange"
          >
          <button class="change-avatar-btn" @click="triggerFileInput">Đổi ảnh đại diện</button>
        </div>
        
        <div class="info-section">
          <div class="form-group">
            <label>Tên đăng nhập:</label>
            <input type="text" v-model="user.username" disabled>
          </div>
          
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="user.email">
          </div>
          
          <div class="form-group">
            <label>Họ và tên:</label>
            <input type="text" v-model="user.full_name">
          </div>
          
          <div class="form-group">
            <label>Vai trò:</label>
            <input type="text" :value="user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'" disabled>
          </div>
          
          <div class="form-group">
            <label>Ngày đăng ký:</label>
            <input type="text" :value="new Date(user.registration_date).toLocaleDateString('vi-VN')" disabled>
          </div>
          
          <div class="form-group">
            <label>Lần đăng nhập cuối:</label>
            <input type="text" :value="user.last_login ? new Date(user.last_login).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'" disabled>
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button @click="handleUpdateProfile" class="save-btn">Lưu thay đổi</button>
        <button @click="$router.push('/')" class="cancel-btn">Hủy</button>

      </div>
    </div>
  </div>
</template>

<script>
import userService from '../services/user.service';

const API_URL = 'http://localhost:3000/api';

export default {
  name: 'ProfileView',
  data() {
    return {
      user: null,
      loading: false,
      error: null,
      selectedFile: null
    };
  },
  async created() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.user_id) {
        this.$router.push('/login');
        return;
      }
      await this.fetchUserInfo();
    } catch (error) {
      console.error('Error in created:', error);
      this.$router.push('/login');
    }
  },
  methods: {
    async fetchUserInfo() {
      this.loading = true;
      this.error = null;
      try {
        const userData = await userService.getCurrentUser();
        if (userData) {
          this.user = userData;
        } else {
          this.error = 'Không tìm thấy thông tin người dùng';
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          this.error = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
        }
      } finally {
        this.loading = false;
      }
    },
    async handleUpdateProfile() {
      try {
        await userService.updateUser(this.user);
        alert('Cập nhật thông tin thành công!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    getProfilePictureUrl(profilePicture) {
      if (!profilePicture) {
        return '/default-avatar.png';
      }
      const url = `${API_URL.replace('/api', '')}${profilePicture}`;
      console.log('Profile picture URL:', url); // Debug log
      return url;
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Kiểm tra định dạng file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      this.selectedFile = file;
      this.loading = true;

      try {
        const formData = new FormData();
        formData.append('profile_picture', file);

        const response = await userService.updateProfilePicture(formData);
        console.log('Update profile picture response:', response); // Debug log
        
        if (response && response.profile_picture) {
          this.user.profile_picture = response.profile_picture;
          console.log('Updated user profile picture:', this.user.profile_picture); // Debug log
          
          // Cập nhật localStorage
          const user = JSON.parse(localStorage.getItem('user'));
          if (user) {
            user.profile_picture = response.profile_picture;
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          alert('Cập nhật ảnh đại diện thành công!');
        } else {
          alert('Không thể cập nhật ảnh đại diện');
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        alert(error.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
      } finally {
        this.loading = false;
        // Reset input file
        event.target.value = '';
      }
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
  background: #fdf3f2;
  border-radius: 5px;
  margin: 1rem 0;
}

.profile-content {
  padding: 2rem;
}

.profile-content h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.profile-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.avatar-section {
  flex: 0 0 200px;
  text-align: center;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #3498db;
}

.change-avatar-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.change-avatar-btn:hover {
  background: #2980b9;
}

.info-section {
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group input:disabled {
  background: #f5f6fa;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.save-btn, .cancel-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn {
  background: #2ecc71;
  color: white;
}

.save-btn:hover {
  background: #27ae60;
}

.cancel-btn {
  background: #e74c3c;
  color: white;
}

.cancel-btn:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .profile-section {
    flex-direction: column;
    align-items: center;
  }
  
  .avatar-section {
    flex: none;
  }
  
  .info-section {
    width: 100%;
  }
}
</style> 