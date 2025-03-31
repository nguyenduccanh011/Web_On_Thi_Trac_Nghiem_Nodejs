<template>
  <div>
    <h2>Tạo danh mục mới</h2>
    <form @submit.prevent="createCategory">
      <div>
        <label for="category_name">Tên danh mục:</label>
        <input type="text" id="category_name" v-model="categoryName" required />
      </div>
      <div>
        <label for="description">Mô tả:</label>
        <textarea id="description" v-model="description"></textarea>
      </div>
      <button type="submit">Tạo danh mục</button>
    </form>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categoryName: "",
      description: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async createCategory() {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.post(
          "/api/categories",
          {
            category_name: this.categoryName,
            description: this.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token cùng với yêu cầu
            },
          }
        );
        this.successMessage = "Danh mục đã được tạo thành công!";
        this.errorMessage = "";
        this.categoryName = "";
        this.description = "";
        console.log("Danh mục đã được tạo:", response.data);
      } catch (error) {
        this.successMessage = "";
        this.errorMessage = "Đã xảy ra lỗi khi tạo danh mục. Vui lòng thử lại.";
        if (error.response) {
          this.errorMessage += ` Mã lỗi: ${error.response.status}.`;
          if (error.response.data && error.response.data.message) {
            this.errorMessage += ` Chi tiết: ${error.response.data.message}`;
          }
        } else if (error.request) {
          this.errorMessage += "Lỗi kết nối mạng";
        } else {
          this.errorMessage += ` Lỗi: ${error.message}`;
        }
        console.error("Lỗi khi tạo danh mục:", error);
      }
    },
  },
};
</script>
