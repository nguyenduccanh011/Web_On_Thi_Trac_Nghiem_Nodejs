<template>
    <div>
      <h1>Danh sách câu hỏi</h1>
      <ul v-if="questions.length > 0">
        <li v-for="question in questions" :key="question.question_id">
          {{ question.question_text }} (Danh mục: {{ question.category ? question.category.category_name : 'Không có' }})
          <p>A. {{question.option_a}}</p>
          <p>B. {{question.option_b}}</p>
          <p>C. {{question.option_c}}</p>
          <p>D. {{question.option_d}}</p>
        </li>
      </ul>
      <p v-else>Không có câu hỏi nào.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'QuestionList',
    data() {
      return {
        questions: [],
      };
    },
    mounted() {
      this.fetchQuestions();
    },
    methods: {
      async fetchQuestions() {
        try {
          const response = await axios.get('/api/questions');
          this.questions = response.data;
        } catch (error) {
          console.error('Lỗi khi lấy danh sách câu hỏi:', error);
        }
      },
    },
  };
  </script>