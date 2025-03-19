<template>
    <div>
      <h2>Tạo câu hỏi mới</h2>
      <form @submit.prevent="createQuestion">
        <div>
          <label for="question_text">Câu hỏi:</label>
          <input type="text" id="question_text" v-model="questionText" required>
        </div>
        <div>
            <label for="option_a">Lựa chọn A</label>
            <input type="text" id="option_a" v-model="optionA" required>
        </div>
        <div>
            <label for="option_b">Lựa chọn B</label>
            <input type="text" id="option_b" v-model="optionB" required>
        </div>
          <div>
            <label for="option_c">Lựa chọn C</label>
            <input type="text" id="option_c" v-model="optionC" required>
        </div>
        <div>
          <label for="option_d">Lựa chọn D</label>
            <input type="text" id="option_d" v-model="optionD" required>
        </div>
        <div>
            <label for="correct_answer">Đáp án Đúng</label>
             <select id="correct_answer" v-model="correctAnswer" required>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
             </select>
        </div>
        <div>
            <label for="category_id">Danh Mục</label>
            <input type="number" id="category_id" v-model.number="categoryId" required>
        </div>
        <div>
           <label for="explanation">Giải Thích</label>
            <textarea id="explanation" v-model="explanation"></textarea>
        </div>
        <button type="submit">Tạo câu hỏi</button>
      </form>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        categoryId: null, // hoặc giá trị mặc định phù hợp
        explanation: '',
        successMessage: '',
        errorMessage: '',
      };
    },
    methods: {
      async createQuestion() {
        try {
          const response = await axios.post('/api/questions', {
            question_text: this.questionText,
            option_a: this.optionA,
            option_b: this.optionB,
            option_c: this.optionC,
            option_d: this.optionD,
            correct_answer: this.correctAnswer,
            category_id: this.categoryId,
            explanation: this.explanation,
  
          });
          this.successMessage = 'Câu hỏi đã được tạo thành công!';
          this.errorMessage = ''; // Xóa thông báo lỗi (nếu có)
           // Reset form
          this.questionText = '';
          this.optionA = '';
          this.optionB = '';
          this.optionC = '';
          this.optionD = '';
          this.correctAnswer = '';
          this.categoryId = null;
          this.explanation = '';
          console.log('Câu hỏi đã được tạo:', response.data);
          // Chuyển hướng đến trang danh sách câu hỏi (tùy chọn)
          // this.$router.push('/questions');
  
        } catch (error) {
            this.successMessage = ''; // Xóa thông báo thành công
            this.errorMessage = 'Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại.';
          if (error.response) {
               // Lỗi từ phía server (ví dụ: 400 Bad Request, 422 Unprocessable Entity)
               this.errorMessage += ` Mã lỗi: ${error.response.status}.`;
              if (error.response.data && error.response.data.message) {
                 this.errorMessage += ` Chi tiết: ${error.response.data.message}`;
               }
            }
            else if(error.request){
              //lỗi request không được gửi đi
              this.errorMessage += 'Lỗi kết nối mạng'
            }
             else {
              // Các lỗi khác
              this.errorMessage += ` Lỗi: ${error.message}`;
            }
          console.error('Lỗi khi tạo câu hỏi:', error);
  
        }
      },
    },
  };
  </script>