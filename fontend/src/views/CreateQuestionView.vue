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

      <div class="form-row">
        <div class="form-group half-width with-add-button">
          <!-- {/* Thêm class để style */} -->
          <label for="difficulty_level_id" class="form-label">Độ khó:</label>
          <div class="select-with-button">
            <select
              id="difficulty_level_id"
              v-model="selectedDifficultyId"
              required
              class="form-select"
            >
              <!-- <option disabled value="">-- Chọn độ khó --</option> -->
            </select>
            <button
              type="button"
              @click="openAddDifficultyPopup"
              class="add-inline-btn"
              title="Thêm độ khó mới"
            >
              +
            </button>
          </div>
        </div>
        <div class="form-group half-width">
          <!-- {/* Giữ trống hoặc thêm trường khác nếu cần */} -->
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

    <div v-if="showAddDifficultyPopup" class="popup-overlay">
      <div class="popup-content">
        <h3 class="popup-title">Thêm Độ Khó Mới</h3>
        <form @submit.prevent="submitNewDifficulty" class="popup-form">
          <div class="form-group">
            <label for="difficulty_level_text" class="form-label"
              >Tên độ khó:</label
            >
            <input
              type="text"
              id="difficulty_level_text"
              v-model="DifficultyLevelText"
              required
              class="form-input"
              placeholder="Nhập tên độ khó (ví dụ: Dễ, Trung bình, Khó)"
            />
          </div>
          <p v-if="addDifficultyError" class="error-message small-error">
            {{ addDifficultyError }}
          </p>
          <div class="popup-actions">
            <button type="submit" class="submit-btn popup-btn">Thêm</button>
            <button
              type="button"
              @click="closeAddDifficultyPopup"
              class="cancel-btn popup-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
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
      options: [{ text: "" }, { text: "" }], // Ít nhất 2 lựa chọn
      correctAnswer: "A", // Mặc định là lựa chọn đầu tiên
      categoryId: null,
      explanation: "",
      successMessage: "",
      errorMessage: "",
      // --- Dữ liệu mới cho Độ khó ---
      difficultyLevels: [], // Danh sách các độ khó lấy từ API
      selectedDifficultyId: "", // ID của độ khó được chọn
      showAddDifficultyPopup: false, // Cờ để hiển thị/ẩn popup
      DifficultyLevelText: "", // Tên độ khó mới nhập trong popup
      addDifficultyError: "", // Thông báo lỗi cho popup thêm độ khó
      // --- Kết thúc dữ liệu mới ---
    };
  },
  mounted() {
    this.loadCategories();
    this.loadDifficultyLevels(); // Gọi hàm tải độ khó khi component được gắn
  },
  methods: {
    addOption() {
      if (this.options.length < 10) {
        this.options.push({ text: "" });
        // Cập nhật đáp án đúng mặc định là lựa chọn cuối nếu muốn
        // this.correctAnswer = String.fromCharCode(65 + this.options.length - 1);
      }
    },
    removeOption(index) {
      if (this.options.length > 2) {
        // Đảm bảo luôn có ít nhất 2 lựa chọn
        const removedOptionChar = String.fromCharCode(65 + index);
        this.options.splice(index, 1);

        // Điều chỉnh lại correctAnswer nếu cần
        if (this.correctAnswer === removedOptionChar) {
          this.correctAnswer = "A"; // Mặc định về A nếu xóa đáp án đang đúng
        } else {
          // Cập nhật lại ký tự đáp án đúng nếu xóa lựa chọn đứng trước nó
          const correctIndex = this.correctAnswer.charCodeAt(0) - 65;
          if (index < correctIndex) {
            this.correctAnswer = String.fromCharCode(
              this.correctAnswer.charCodeAt(0) - 1
            );
          }
        }
        // Cập nhật lại select đáp án đúng vì index có thể thay đổi
        this.$nextTick(() => {
          const selectElement = document.getElementById("correct_answer");
          if (selectElement) {
            const validValues = this.options.map((_, i) =>
              String.fromCharCode(65 + i)
            );
            if (!validValues.includes(this.correctAnswer)) {
              this.correctAnswer = "A"; // Fallback về A
            }
          }
        });
      }
    },
    async createQuestion() {
      // --- Kiểm tra độ khó đã được chọn chưa ---
      if (!this.selectedDifficultyId) {
        this.errorMessage = "Vui lòng chọn độ khó cho câu hỏi.";
        // Xóa thông báo lỗi sau 3 giây
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
        return; // Dừng thực thi nếu chưa chọn độ khó
      }
      // --- Kết thúc kiểm tra ---

      this.successMessage = "";
      this.errorMessage = "";
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.errorMessage = "Lỗi xác thực: Không tìm thấy token.";
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);
          return;
        }

        const correctOptionIndex = this.correctAnswer.charCodeAt(0) - 65;
        const correctOptionText = this.options[correctOptionIndex]?.text; // Lấy text của đáp án đúng

        if (!correctOptionText) {
          this.errorMessage = "Lỗi: Không tìm thấy nội dung đáp án đúng.";
          setTimeout(() => {
            this.errorMessage = "";
          }, 3000);
          return;
        }

        const payload = {
          question_text: this.questionText,
          answers: this.options.map((option) => option.text),
          correct_answer: correctOptionText, // Gửi text của đáp án đúng
          category_id: this.categoryId,
          difficult_level_id: this.selectedDifficultyId, // *** Thêm ID độ khó ***
          explanation: this.explanation,
        };

        console.log("Sending payload:", payload); // Log để kiểm tra

        const response = await axios.post("/api/questions", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.successMessage = "Câu hỏi đã được tạo thành công!";

        // Reset form
        this.questionText = "";
        this.options = [{ text: "" }, { text: "" }];
        this.correctAnswer = "A";
        this.explanation = "";
        // Reset category và difficulty về giá trị đầu tiên (nếu có)
        const categorySelect = document.getElementById("category_id");
        const difficultySelect = document.getElementById("difficulty_level_id");
        this.categoryId =
          categorySelect?.options.length > 0
            ? categorySelect.options[0].value
            : null;
        this.selectedDifficultyId =
          difficultySelect.options.length > 0
            ? difficultySelect.options[0].value
            : null;

        console.log("Câu hỏi đã được tạo:", response.data);

        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      } catch (error) {
        this.errorMessage = "Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại.";
        if (error.response) {
          this.errorMessage += ` Mã lỗi: ${error.response.status}.`;
          // Cố gắng lấy thông báo lỗi cụ thể từ backend nếu có
          const backendError =
            error.response.data?.message || error.response.data?.error;
          if (backendError) {
            this.errorMessage += ` Chi tiết: ${backendError}`;
          }
        } else if (error.request) {
          this.errorMessage += " Lỗi kết nối mạng.";
        } else {
          this.errorMessage += ` Lỗi: ${error.message}`;
        }
        console.error("Lỗi khi tạo câu hỏi:", error);
        // Không tự động xóa lỗi này, để người dùng đọc
      }
    },
    // --- Các phương thức cho Danh mục (giữ nguyên) ---
    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        // Giả sử API trả về mảng các object { category_id: ..., category_name: ... }
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        this.errorMessage = "Không thể tải danh sách danh mục.";
        return []; // Trả về mảng rỗng khi lỗi
      }
    },
    loadCategories() {
      const categorySelect = document.getElementById("category_id");
      if (!categorySelect) return; // Thoát nếu không tìm thấy element

      categorySelect.innerHTML =
        '<option disabled value="">-- Đang tải danh mục --</option>'; // Thông báo đang tải

      this.fetchCategories()
        .then((categories) => {
          categorySelect.innerHTML = ""; // Xóa thông báo tải
          if (!categories || categories.length === 0) {
            categorySelect.innerHTML =
              '<option disabled value="">-- Không có danh mục --</option>';
            return;
          }

          categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.category_id;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
          });
          // Set giá trị mặc định cho categoryId là option đầu tiên
          if (categories.length > 0) {
            this.categoryId = categories[0].category_id;
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xử lý danh mục:", error);
          categorySelect.innerHTML =
            '<option disabled value="">-- Lỗi tải danh mục --</option>';
        });
    },
    loadDifficultyLevels() {
      const difficultyLevelSelect = document.getElementById(
        "difficulty_level_id"
      );
      if (!difficultyLevelSelect) return; // Thoát nếu không tìm thấy element

      difficultyLevelSelect.innerHTML =
        '<option disabled value="">-- Đang tải độ khó --</option>'; // Thông báo đang tải

      this.fetchDifficultyLevels()
        .then((difficultyLevels) => {
          difficultyLevelSelect.innerHTML = ""; // Xóa thông báo tải
          if (!difficultyLevels || difficultyLevels.length === 0) {
            difficultyLevelSelect.innerHTML =
              '<option disabled value="">-- Không có độ khó --</option>';
            return;
          }

          difficultyLevels.forEach((difficultyLevel) => {
            const option = document.createElement("option");
            option.value = difficultyLevel.difficult_level_id;
            option.textContent = difficultyLevel.difficult_level_text;
            difficultyLevelSelect.appendChild(option);
          });

          if (difficultyLevels.length > 0) {
            this.selectedDifficultyId = difficultyLevels[0].difficult_level_id;
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xử lý danh mục:", error);
          difficultyLevelSelect.innerHTML =
            '<option disabled value="">-- Lỗi tải độ khó --</option>';
        });
    },
    // --- Các phương thức MỚI cho Độ khó ---
    async fetchDifficultyLevels() {
      try {
        const response = await axios.get("/api/difficulty-level");
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy độ khó:", error);
        this.errorMessage = "Không thể tải danh sách độ khó.";
        return []; // Trả về mảng rỗng khi lỗi
      }
    },
    openAddDifficultyPopup() {
      this.DifficultyLevelText = ""; // Xóa tên cũ (nếu có)
      this.addDifficultyError = ""; // Xóa lỗi cũ
      this.showAddDifficultyPopup = true;
    },
    closeAddDifficultyPopup() {
      this.showAddDifficultyPopup = false;
    },
    async submitNewDifficulty() {
      if (!this.DifficultyLevelText.trim()) {
        this.addDifficultyError = "Vui lòng nhập tên độ khó.";
        return;
      }
      this.addDifficultyError = ""; // Xóa lỗi nếu đã nhập

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.addDifficultyError = "Lỗi xác thực.";
          return;
        }
        const payload = {
          difficult_level_text: this.DifficultyLevelText.trim(),
        };

        const response = await axios.post("/api/difficulty-level", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Thêm thành công
        this.closeAddDifficultyPopup();
        this.successMessage = `Đã thêm độ khó "${this.DifficultyLevelText}"!`;

        // Quan trọng: Tải lại danh sách độ khó để cập nhật dropdown
        this.loadDifficultyLevels();

        // Tùy chọn: Tự động chọn độ khó vừa thêm
        if (response.data && response.data.difficulty_level_id) {
          // Giả sử API trả về ID của cái mới
          this.selectedDifficultyId = response.data.difficulty_level_id;
        } else {
          // Hoặc chọn cái cuối cùng trong danh sách mới cập nhật
          if (this.difficultyLevels.length > 0) {
            this.selectedDifficultyId =
              this.difficultyLevels[
                this.difficultyLevels.length - 1
              ].difficulty_level_id;
          }
        }

        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      } catch (error) {
        console.error("Lỗi khi thêm độ khó:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.addDifficultyError = `Lỗi: ${error.response.data.message}`;
        } else if (error.response) {
          this.addDifficultyError = `Lỗi máy chủ: ${error.response.status} - ${error}`;
        } else {
          this.addDifficultyError =
            "Đã xảy ra lỗi mạng hoặc lỗi không xác định.";
        }
      }
    },
    // --- Phương thức lấy text đáp án đúng (ĐÃ SỬA LỖI) ---
    // getCorrectAnswerText() {
    //     // Không cần phương thức này nữa nếu gửi text trực tiếp trong createQuestion
    //     // const correctIndex = this.correctAnswer.charCodeAt(0) - 65;
    //     // if (this.options[correctIndex]) {
    //     //   return this.options[correctIndex].text;
    //     // }
    //     // return ""; // Trả về rỗng nếu không tìm thấy
    // },
  },
};
</script>

<style src="./../../public/style.css"></style>
