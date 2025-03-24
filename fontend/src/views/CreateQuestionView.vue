<template>
  <div class="question-container">
    <h2 class="question-title">Tạo câu hỏi mới</h2>
    <form @submit.prevent="createQuestion" class="question-form">
      <div class="form-group">
        <label for="question_text" class="form-label">Câu hỏi:</label>
        <textarea
          id="question_text"
          v-model="questionText"
          required
          class="form-input"
          placeholder="Nhập câu hỏi của bạn ở đây..."
        ></textarea>
      </div>

      <div class="options-container">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="form-group option-group"
        >
          <label :for="'option_' + index" class="form-label">
            Lựa chọn {{ String.fromCharCode(65 + index) }}:
          </label>
          <div class="option-input-wrapper">
            <input
              type="text"
              :id="'option_' + index"
              v-model="options[index].text"
              required
              class="form-input"
            />
            <button
              v-if="index > 1"
              type="button"
              @click="removeOption(index)"
              class="remove-option-btn"
              title="Xóa đáp án này"
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      <div class="button-row">
        <button
          type="button"
          @click="addOption"
          :disabled="options.length >= 10"
          class="add-option-btn"
        >
          <span class="btn-icon">+</span> Thêm đáp án
        </button>
        <p v-if="options.length >= 10" class="limit-message">
          Đã đạt giới hạn 10 đáp án.
        </p>
      </div>

      <div class="form-row">
        <div class="form-group half-width">
          <label for="correct_answer" class="form-label">Đáp án đúng:</label>
          <select
            id="correct_answer"
            v-model="correctAnswer"
            required
            class="form-select"
          >
            <option
              v-for="(option, index) in options"
              :key="index"
              :value="String.fromCharCode(65 + index)"
            >
              {{ String.fromCharCode(65 + index) }}
            </option>
          </select>
        </div>

        <div class="form-group half-width">
          <label for="category_id" class="form-label">Danh mục:</label>
          <select
            id="category_id"
            v-model="categoryId"
            required
            class="form-select"
          ></select>
        </div>
      </div>

      <div class="form-group">
        <label for="explanation" class="form-label">Giải thích:</label>
        <textarea
          id="explanation"
          v-model="explanation"
          class="form-textarea"
          rows="4"
          placeholder="Giải thích lý do tại sao đáp án được chọn là đúng..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">
          <span class="btn-icon">✓</span> Tạo câu hỏi
        </button>
      </div>
    </form>

    <div v-if="successMessage" class="success-message">
      <span class="message-icon">✓</span> {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">
      <span class="message-icon">!</span> {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "QuestionForm",
  data() {
    return {
      questionText: "",
      options: [{ text: "" }, { text: "" }],
      correctAnswer: "A",
      categoryId: null,
      explanation: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  mounted() {
    this.loadCategories();
  },
  methods: {
    addOption() {
      if (this.options.length < 10) {
        this.options.push({ text: "" });
        // Auto update correct answer to the last option
        this.correctAnswer = String.fromCharCode(65 + this.options.length - 1);
      }
    },
    removeOption(index) {
      if (this.options.length > 2) {
        this.options.splice(index, 1);

        // If removing the option that was set as correct, default to first option
        if (this.correctAnswer === String.fromCharCode(65 + index)) {
          this.correctAnswer = "A";
        }
        // If removing an option before the current correct answer, adjust the correct answer
        else if (this.correctAnswer > String.fromCharCode(65 + index)) {
          this.correctAnswer = String.fromCharCode(
            this.correctAnswer.charCodeAt(0) - 1
          );
        }
      }
    },
    async createQuestion() {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        this.successMessage = "";
        this.errorMessage = "";

        const payload = {
          question_text: this.questionText,
          answers: this.options.map((option) => option.text),
          correct_answer: this.getCorrectAnswerText(),
          category_id: this.categoryId,
          explanation: this.explanation,
        };

        const response = await axios.post("/api/questions", payload, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token cùng với yêu cầu
          },
        });
        this.successMessage = "Câu hỏi đã được tạo thành công!";

        // Reset form
        this.questionText = "";
        this.options = [{ text: "" }, { text: "" }];
        this.correctAnswer = "A";
        this.categoryId =
          document.getElementById("category_id").options[0].value;
        this.explanation = "";

        console.log("Câu hỏi đã được tạo:", response.data);

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      } catch (error) {
        this.errorMessage = "Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại.";

        if (error.response) {
          this.errorMessage += ` Mã lỗi: ${error.response.status}.`;
          if (error.response.data && error.response.data.message) {
            this.errorMessage += ` Chi tiết: ${error.response.data.message}`;
          }
        } else if (error.request) {
          this.errorMessage += " Lỗi kết nối mạng.";
        } else {
          this.errorMessage += ` Lỗi: ${error.message}`;
        }

        console.error("Lỗi khi tạo câu hỏi:", error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        this.categories = response.data;
        // console.log("Danh mục đã được tải:", this.categories);

        return this.categories;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    },
    loadCategories() {
      var categorySelect = document.getElementById("category_id");
      this.fetchCategories()
        .then((categories) => {
          categories.forEach((category) => {
            var option = document.createElement("option");
            option.value = category.category_id;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
          });
        })
        .catch((error) => {
          console.error("Lỗi khi tải danh mục:", error);
        })
        .finally(() => {
          // Set default selected option
          if (categorySelect.options.length > 0) {
            // console.log(categorySelect.options.length);
            this.categoryId = categorySelect.options[0].value;
          }
        });
    },
    getCorrectAnswerText() {
      // console.log(this.correctAnswer);
      var selectedElement = document.getElementById("category_id");
      var selectedOption =
        selectedElement.options[selectedElement.selectedIndex];
      return selectedOption.text;
    },
  },
};
</script>

<style src="./../../public/style.css"></style>
