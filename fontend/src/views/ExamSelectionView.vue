<template>
  <div class="container mt-5">
    <h2 class="mb-4">📚 Chọn Đề thi Thử {{ searchQuery ? ` - Kết quả cho "${searchQuery}"` : '' }}</h2>

    <div v-if="isLoading" class="alert alert-info">
      Đang tải danh sách đề thi...
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="filteredExams.length === 0" class="alert alert-warning">
      {{ searchQuery ? `Không tìm thấy đề thi nào phù hợp với "${searchQuery}"` : 'Hiện chưa có đề thi nào.' }}
    </div>

    <div v-else class="list-group exam-list">
      <div
        v-for="exam in filteredExams"
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
        <button
          class="btn btn-primary btn-sm start-button" style="margin-left: 10px;"
          @click="startExamEdit(exam.exam_id)"
        >
          Chỉnh sửa đề thi
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ExamSelectionView",
  data() {
    return {
      exams: [],
      isLoading: true,
      error: null,
    };
  },
  computed: {
    searchQuery() {
      return this.$route.query.exam_name || '';
    },
    searchResults() {
      return this.$route.query.results ? JSON.parse(this.$route.query.results) : null;
    },
    filteredExams() {
      const examList = this.searchResults || this.exams;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return examList.filter(exam => 
          exam.exam_name.toLowerCase().includes(query)
        );
      }
      // Nếu không có searchQuery, hiển thị tất cả
      return examList;
    }
  },
  async mounted() {
    if (!this.searchResults) {
      await this.fetchExams();
    } else {
      this.isLoading = false;
    }
  },
  methods: {
    async fetchExams() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get("/api/exams");
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
      this.$router.push({ name: "TakeExam", params: { examId: examId } });
    },
    // Chỉnh sửa đề thi
    startExamEdit(examId) {
      this.$router.push({ 
            name: 'EditExam', // Tên route của trang kết quả
            query: { 
              examId: examId,
             
            }
           // console.log('chạy đến đây');
          });
     
    }
  }
};
</script>

<style scoped>
@import "./../../public/style.css";

.exam-container {
  max-width: 800px;
}

.exam-list .list-group-item {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: default;
}

.exam-list .list-group-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.exam-name {
  color: #0d6efd;
}

.exam-description {
  color: #6c757d;
  font-size: 0.95em;
}

.start-button {
  margin-top: 10px;
}
</style>