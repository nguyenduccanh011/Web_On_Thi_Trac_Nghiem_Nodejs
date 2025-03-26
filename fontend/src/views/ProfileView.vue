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
          <img :src="user.profile_picture || '/default-avatar.png'" alt="Avatar" class="avatar">
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
        this.$toast.success('Cập nhật thông tin thành công!');
      } catch (error) {
        console.error('Error updating profile:', error);
        this.$toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.$toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Kiểm tra định dạng file
      if (!file.type.startsWith('image/')) {
        this.$toast.error('Vui lòng chọn file ảnh');
        return;
      }

      this.selectedFile = file;
      this.loading = true;

      try {
        const formData = new FormData();
        formData.append('profile_picture', file);

        const updatedUser = await userService.updateProfilePicture(formData);
        if (updatedUser && updatedUser.profile_picture) {
          this.user.profile_picture = updatedUser.profile_picture;
          this.$toast.success('Cập nhật ảnh đại diện thành công!');
        } else {
          throw new Error('Không thể cập nhật ảnh đại diện');
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        this.$toast.error(error.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
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
  margin: 80px auto 0;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2e86c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  color: #e74c3c;
  padding: 20px;
}

.profile-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.profile-section {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}

.avatar-section {
  text-align: center;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.change-avatar-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.change-avatar-btn:hover {
  background: #e9ecef;
}

.info-section {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: flex-end;
}

.save-btn, .cancel-btn {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.save-btn {
  background: #2e86c1;
  color: white;
  border: none;
}

.save-btn:hover {
  background: #2874a6;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background: #e9ecef;
}
</style> 