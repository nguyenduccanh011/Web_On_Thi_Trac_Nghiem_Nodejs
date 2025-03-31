<template>
  <div class="container mt-5">
    <h2 class="mb-4">📚 Chọn Đề thi Thử</h2>

    <div v-if="isLoading" class="alert alert-info">
      Đang tải danh sách đề thi...
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="exams.length === 0" class="alert alert-warning">
      Hiện chưa có đề thi nào.
    </div>

    <div v-else class="list-group exam-list">
      <div
        v-for="exam in exams"
        :key="exam.exam_id"
        class="list-group-item list-group-item-action flex-column align-items-start mb-3 p-3 border rounded shadow-sm exam-item"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1 exam-name">{{ exam.exam_name }}</h5>
          <small class="text-muted">{{
            exam.category?.category_name || "Chưa phân loại"
          }}</small>
        </div>
        <p class="mb-2 exam-description">
          {{ exam.description || "Không có mô tả." }}
        </p>
        <button
          class="btn btn-primary btn-sm start-button"
          @click="startExam(exam.exam_id)"
        >
          🚀 Bắt đầu Thi
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Hoặc dùng fetch nếu bạn thích

export default {
  name: "ExamSelectionView",
  data() {
    return {
      exams: [],
      isLoading: true,
      error: null,
    };
  },
  async mounted() {
    await this.fetchExams();
  },
  methods: {
    async fetchExams() {
      this.isLoading = true;
      this.error = null;
      try {
        // Gọi API lấy danh sách exams (sử dụng endpoint từ examRouter)
        const response = await axios.get("/api/exams"); // Không cần token nếu route này public
        this.exams = response.data || [];
      } catch (err) {
        console.error("Lỗi khi tải danh sách đề thi:", err);
        this.error = "Không thể tải danh sách đề thi. Vui lòng thử lại.";
        if (err.response) {
          this.error += ` (Lỗi: ${err.response.status})`;
        }
      } finally {
        this.isLoading = false;
      }
    },
    startExam(examId) {
      // Điều hướng đến trang làm bài thi với examId đã chọn
      this.$router.push({ name: "TakeExam", params: { examId: examId } });
      // Đảm bảo bạn đã định nghĩa route với name 'TakeExam' và param 'examId' trong router
      // Ví dụ: path: '/exams/:examId/take', name: 'TakeExam', component: TakeExamView, props: true
    },
  },
};
</script>

<style scoped>
/* Thêm CSS scoping hoặc import file CSS chung */
@import "./../../public/style.css"; /* Đường dẫn tới file CSS */

.exam-container {
  max-width: 800px; /* Giới hạn chiều rộng */
}

.exam-list .list-group-item {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: default; /* Bỏ cursor pointer mặc định của list-group-item-action */
}

.exam-list .list-group-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important; /* Tăng shadow khi hover */
}

.exam-name {
  color: #0d6efd; /* Màu primary của Bootstrap */
}

.exam-description {
  color: #6c757d; /* Màu secondary text */
  font-size: 0.95em;
}

.start-button {
  margin-top: 10px;
}
</style>
