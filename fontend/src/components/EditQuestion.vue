<template>
    <div>
      <h2>Chỉnh sửa câu hỏi</h2>
      <form @submit.prevent="updateQuestion" v-if="question">
        <div>
          <label for="question_text">Câu hỏi:</label>
          <input type="text" id="question_text" v-model="question.question_text" required>
        </div>
        <div>
          <label for="option_a">Lựa chọn A:</label>
          <input type="text" id="option_a" v-model="question.option_a" required>
        </div>
        <div>
          <label for="option_b">Lựa chọn B:</label>
          <input type="text" id="option_b" v-model="question.option_b" required>
        </div>
        <div>
          <label for="option_c">Lựa chọn C:</label>
          <input type="text" id="option_c" v-model="question.option_c" required>
        </div>
        <div>
          <label for="option_d">Lựa chọn D:</label>
          <input type="text" id="option_d" v-model="question.option_d" required>
        </div>
        <div>
          <label for="correct_answer">Đáp án đúng:</label>
          <select id="correct_answer" v-model="question.correct_answer" required>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div>
          <label for="category_id">Danh mục:</label>
          <input type="number" id="category_id" v-model.number="question.category_id" required>
        </div>
        <div>
          <label for="explanation">Giải thích:</label>
          <textarea id="explanation" v-model="question.explanation"></textarea>
        </div>
  
        <button type="submit">Cập nhật</button>
      </form>
      <p v-else>Đang tải thông tin câu hỏi...</p>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color:red">{{errorMessage}}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'EditQuestion',
    data() {
      return {
        question: null, // Lưu thông tin câu hỏi cần chỉnh sửa
        successMessage: '',
        errorMessage: '',
      };
    },
    mounted() {
      this.fetchQuestion();
    },
    methods: {
      async fetchQuestion() {
        try {
          const questionId = this.$route.params.id;
          const response = await axios.get(`/api/questions/${questionId}`);
          this.question = response.data;
        } catch (error) {
          console.error('Lỗi khi tải thông tin câu hỏi:', error);
           this.errorMessage = 'Lỗi khi tải thông tin câu hỏi: ' + error
        }
      },
      async updateQuestion() {
        try {
          const questionId = this.$route.params.id;
          const response = await axios.put(`/api/questions/${questionId}`, this.question);
          this.successMessage = 'Cập nhật câu hỏi thành công';
          console.log('Câu hỏi đã được cập nhật:', response.data);
          // Chuyển hướng đến trang chi tiết câu hỏi (tùy chọn)
          this.$router.push(`/questions/${questionId}`);
        } catch (error) {
           this.errorMessage = 'Đã xảy ra lỗi khi cập nhật câu hỏi. Vui lòng thử lại.';
          if (error.response) {
               this.errorMessage += ` Mã lỗi: ${error.response.status}.`;
              if (error.response.data && error.response.data.message) {
                 this.errorMessage += ` Chi tiết: ${error.response.data.message}`;
               }
            }
            else if(error.request){
              this.errorMessage += 'Lỗi kết nối mạng'
            }
             else {
              this.errorMessage += ` Lỗi: ${error.message}`;
            }
          console.error('Lỗi khi cập nhật câu hỏi:', error);
  
        }
      },
    },
  };
  </script>