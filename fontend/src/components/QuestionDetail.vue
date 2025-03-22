<template>
    <div>
      <h1 v-if="question">Chi tiết câu hỏi: {{ question.question_text }}</h1>
      <div v-if="question">
        <p><strong>ID:</strong> {{ question.question_id }}</p>
        <p><strong>Nội dung:</strong> {{ question.question_text }}</p>
        <p><strong>Lựa chọn A:</strong> {{ question.option_a }}</p>
        <p><strong>Lựa chọn B:</strong> {{ question.option_b }}</p>
        <p><strong>Lựa chọn C:</strong> {{ question.option_c }}</p>
        <p><strong>Lựa chọn D:</strong> {{ question.option_d }}</p>
        <p><strong>Đáp án đúng:</strong> {{ question.correct_answer }}</p>
        <p><strong>Danh mục:</strong> {{ question.category ? question.category.category_name : 'Không có' }}</p>
        <p><strong>Giải thích:</strong> {{ question.explanation }}</p>
  
      </div>
      <p v-else>Đang tải...</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'QuestionDetail',
    data() {
      return {
        question: null, // Lưu thông tin chi tiết câu hỏi
      };
    },
    mounted() {
      this.fetchQuestion();
    },
    methods: {
      async fetchQuestion() {
        try {
          const questionId = this.$route.params.id; // Lấy ID từ URL
          const response = await axios.get(`/api/questions/${questionId}`);
          this.question = response.data;
        } catch (error) {
          console.error('Lỗi khi lấy chi tiết câu hỏi:', error);
          // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
        }
      },
    },
  };
  </script>