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

        <div class="form-group half-width with-add-button">
          <label for="category_id" class="form-label">Danh mục:</label>
          <div class="select-with-button">
            <select
              id="category_id"
              v-model="categoryId"
              required
              class="form-select"
            ></select>
            <button
              type="button"
              @click="openAddCategoryPopup"
              class="add-inline-btn"
              title="Thêm danh mục mới"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half-width with-add-button">
          <label for="difficulty_level_id" class="form-label">Độ khó:</label>
          <div class="select-with-button">
            <select
              id="difficulty_level_id"
              v-model="selectedDifficultyId"
              required
              class="form-select"
            ></select>
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
        <div class="form-group half-width"></div>
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

    <div v-if="showAddCategoryPopup" class="popup-overlay">
      <div class="popup-content">
        <h3 class="popup-title">Thêm Danh Mục Mới</h3>
        <form @submit.prevent="submitNewCategory" class="popup-form">
          <div class="form-group">
            <label for="new_category_name" class="form-label"
              >Tên danh mục:</label
            >
            <input
              type="text"
              id="new_category_name"
              v-model="newCategoryName"
              required
              class="form-input"
              placeholder="Nhập tên danh mục..."
            />
          </div>
          <div class="form-group">
            <label for="new_category_description" class="form-label"
              >Mô tả:</label
            >
            <textarea
              id="new_category_description"
              v-model="newCategoryDescription"
              class="form-textarea"
              rows="3"
              placeholder="Nhập mô tả ngắn (không bắt buộc)..."
            ></textarea>
          </div>
          <p v-if="addCategoryError" class="error-message small-error">
            {{ addCategoryError }}
          </p>
          <div class="popup-actions">
            <button type="submit" class="submit-btn popup-btn">Thêm</button>
            <button
              type="button"
              @click="closeAddCategoryPopup"
              class="cancel-btn popup-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
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
      categoryId: null, // Sẽ được gán giá trị đầu tiên sau khi load
      explanation: "",
      successMessage: "",
      errorMessage: "",

      // --- Dữ liệu cho Độ khó ---
      difficultyLevels: [], // Danh sách các độ khó lấy từ API
      selectedDifficultyId: "", // ID của độ khó được chọn
      showAddDifficultyPopup: false, // Cờ để hiển thị/ẩn popup độ khó
      DifficultyLevelText: "", // Tên độ khó mới nhập trong popup
      addDifficultyError: "", // Thông báo lỗi cho popup thêm độ khó

      // --- START: Dữ liệu MỚI cho Danh mục ---
      categories: [], // Danh sách các danh mục lấy từ API
      showAddCategoryPopup: false, // Cờ để hiển thị/ẩn popup danh mục
      newCategoryName: "", // Tên danh mục mới nhập trong popup
      newCategoryDescription: "", // Mô tả danh mục mới nhập trong popup
      addCategoryError: "", // Thông báo lỗi cho popup thêm danh mục
      // --- END: Dữ liệu MỚI cho Danh mục ---
    };
  },
  mounted() {
    this.loadCategories(); // Tải danh mục
    this.loadDifficultyLevels(); // Tải độ khó
  },
  methods: {
    addOption() {
      if (this.options.length < 10) {
        this.options.push({ text: "" });
      }
    },
    removeOption(index) {
      if (this.options.length > 2) {
        const removedOptionChar = String.fromCharCode(65 + index);
        this.options.splice(index, 1);

        // Điều chỉnh lại correctAnswer nếu cần
        const correctIndexCurrent = this.correctAnswer.charCodeAt(0) - 65;
        if (removedOptionChar === this.correctAnswer) {
          this.correctAnswer = "A"; // Reset về A nếu xóa đáp án đúng
        } else if (index < correctIndexCurrent) {
          // Nếu xóa option đứng trước đáp án đúng hiện tại, giảm ký tự đi 1
          this.correctAnswer = String.fromCharCode(
            this.correctAnswer.charCodeAt(0) - 1
          );
        }
        // Cần $nextTick để DOM cập nhật trước khi kiểm tra giá trị select
        this.$nextTick(() => {
          const selectElement = document.getElementById("correct_answer");
          if (selectElement) {
            const validValues = Array.from(selectElement.options).map(
              (opt) => opt.value
            );
            if (!validValues.includes(this.correctAnswer)) {
              // Nếu giá trị correctAnswer không còn hợp lệ (ví dụ sau khi xóa), reset về A
              this.correctAnswer = "A";
            }
          }
        });
      }
    },
    async createQuestion() {
      // Kiểm tra category và difficulty đã được chọn chưa
      if (!this.categoryId) {
        this.showTemporaryError("Vui lòng chọn danh mục cho câu hỏi.");
        return;
      }
      if (!this.selectedDifficultyId) {
        this.showTemporaryError("Vui lòng chọn độ khó cho câu hỏi.");
        return;
      }

      this.successMessage = "";
      this.errorMessage = "";
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.showTemporaryError("Lỗi xác thực: Không tìm thấy token.");
          return;
        }

        const correctOptionIndex = this.correctAnswer.charCodeAt(0) - 65;
        // Kiểm tra index hợp lệ trước khi truy cập options
        if (
          correctOptionIndex < 0 ||
          correctOptionIndex >= this.options.length ||
          !this.options[correctOptionIndex]
        ) {
          this.showTemporaryError(
            "Lỗi: Đáp án đúng không hợp lệ hoặc chưa được nhập."
          );
          return;
        }
        const correctOptionText = this.options[correctOptionIndex].text;

        if (!correctOptionText) {
          this.showTemporaryError(
            "Lỗi: Không tìm thấy nội dung đáp án đúng hoặc đáp án đúng chưa được nhập."
          );
          return;
        }

        const payload = {
          question_text: this.questionText,
          answers: this.options.map((option) => option.text),
          correct_answer: correctOptionText,
          category_id: this.categoryId,
          difficult_level_id: this.selectedDifficultyId,
          explanation: this.explanation,
        };

        console.log("Sending payload:", payload);

        const response = await axios.post("/api/questions", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.successMessage = "Câu hỏi đã được tạo thành công!";

        // Reset form
        this.resetForm();

        console.log("Câu hỏi đã được tạo:", response.data);

        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      } catch (error) {
        this.handleApiError(error, "tạo câu hỏi");
      }
    },

    resetForm() {
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
        difficultySelect?.options.length > 0
          ? difficultySelect.options[0].value
          : null;
    },

    showTemporaryError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = "";
      }, 3000);
    },

    handleApiError(error, contextAction) {
      this.errorMessage = `Đã xảy ra lỗi khi ${contextAction}. Vui lòng thử lại.`;
      if (error.response) {
        this.errorMessage += ` Mã lỗi: ${error.response.status}.`;
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
      console.error(`Lỗi khi ${contextAction}:`, error);
      // Không tự động xóa lỗi này để người dùng đọc
    },

    // --- START: Phương thức cho Danh mục (Cập nhật) ---
    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        this.categories = response.data || []; // Lưu vào data property
        return this.categories; // Trả về dữ liệu đã lấy
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        this.showTemporaryError("Không thể tải danh sách danh mục.");
        this.categories = []; // Đảm bảo là mảng rỗng khi lỗi
        return [];
      }
    },
    async loadCategories() {
      // Chuyển thành async để đợi fetch
      const categorySelect = document.getElementById("category_id");
      if (!categorySelect) return;

      categorySelect.innerHTML =
        '<option value="" disabled>-- Đang tải danh mục --</option>';

      try {
        const categories = await this.fetchCategories(); // Đợi lấy xong
        categorySelect.innerHTML = ""; // Xóa thông báo tải

        if (!categories || categories.length === 0) {
          categorySelect.innerHTML =
            '<option value="" disabled>-- Chưa có danh mục --</option>';
          this.categoryId = null; // Không có gì để chọn
          return;
        }

        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.category_id;
          option.textContent = category.category_name;
          categorySelect.appendChild(option);
        });

        // Set giá trị mặc định hoặc giữ giá trị đang chọn nếu hợp lệ
        if (
          !this.categoryId ||
          !categories.some((c) => c.category_id == this.categoryId)
        ) {
          this.categoryId = categories[0].category_id; // Chọn cái đầu tiên làm mặc định
        }
      } catch (error) {
        // Lỗi đã được xử lý trong fetchCategories
        categorySelect.innerHTML =
          '<option value="" disabled>-- Lỗi tải danh mục --</option>';
        this.categoryId = null;
      }
    },
    // --- END: Phương thức cho Danh mục ---

    // --- START: Phương thức cho Popup Thêm Danh mục ---
    openAddCategoryPopup() {
      this.newCategoryName = ""; // Reset input
      this.newCategoryDescription = ""; // Reset input
      this.addCategoryError = ""; // Reset lỗi
      this.showAddCategoryPopup = true;
      // Tự động focus vào input tên danh mục
      this.$nextTick(() => {
        document.getElementById("new_category_name")?.focus();
      });
    },
    closeAddCategoryPopup() {
      this.showAddCategoryPopup = false;
    },
    async submitNewCategory() {
      if (!this.newCategoryName.trim()) {
        this.addCategoryError = "Vui lòng nhập tên danh mục.";
        return;
      }
      this.addCategoryError = ""; // Xóa lỗi nếu đã nhập

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.addCategoryError = "Lỗi xác thực.";
          return;
        }
        const payload = {
          category_name: this.newCategoryName.trim(),
          description: this.newCategoryDescription.trim(),
        };

        const response = await axios.post("/api/categories", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Thêm thành công
        const newCategory = response.data; // Giả sử API trả về object danh mục mới { category_id: ..., category_name: ... }
        this.closeAddCategoryPopup();
        this.successMessage = `Đã thêm danh mục "${this.newCategoryName}"!`;

        // Quan trọng: Tải lại danh sách danh mục và chọn cái mới
        await this.loadCategories(); // Đợi tải lại xong

        // Chọn danh mục vừa thêm
        if (newCategory && newCategory.category_id) {
          this.categoryId = newCategory.category_id;
        } else {
          // Nếu API không trả về ID, thử tìm theo tên (ít tin cậy hơn) hoặc chọn cái cuối
          const addedCategory = this.categories.find(
            (cat) => cat.category_name === this.newCategoryName.trim()
          );
          if (addedCategory) {
            this.categoryId = addedCategory.category_id;
          } else if (this.categories.length > 0) {
            // Fallback: chọn cái cuối cùng
            this.categoryId =
              this.categories[this.categories.length - 1].category_id;
          }
        }

        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.addCategoryError = `Lỗi: ${error.response.data.message}`;
        } else if (error.response) {
          this.addCategoryError = `Lỗi máy chủ: ${error.response.status}`;
        } else {
          this.addCategoryError = "Đã xảy ra lỗi mạng hoặc lỗi không xác định.";
        }
      }
    },
    // --- END: Phương thức cho Popup Thêm Danh mục ---

    // --- Phương thức cho Độ khó (Giữ nguyên và cập nhật để phù hợp) ---
    async fetchDifficultyLevels() {
      try {
        const response = await axios.get("/api/difficulty-level");
        this.difficultyLevels = response.data || [];
        return this.difficultyLevels;
      } catch (error) {
        console.error("Lỗi khi lấy độ khó:", error);
        this.showTemporaryError("Không thể tải danh sách độ khó.");
        this.difficultyLevels = [];
        return [];
      }
    },
    async loadDifficultyLevels() {
      // Chuyển thành async
      const difficultyLevelSelect = document.getElementById(
        "difficulty_level_id"
      );
      if (!difficultyLevelSelect) return;

      difficultyLevelSelect.innerHTML =
        '<option value="" disabled>-- Đang tải độ khó --</option>';

      try {
        const difficultyLevels = await this.fetchDifficultyLevels(); // Đợi fetch
        difficultyLevelSelect.innerHTML = ""; // Xóa thông báo tải

        if (!difficultyLevels || difficultyLevels.length === 0) {
          difficultyLevelSelect.innerHTML =
            '<option value="" disabled>-- Chưa có độ khó --</option>';
          this.selectedDifficultyId = null; // Không có gì để chọn
          return;
        }

        difficultyLevels.forEach((difficultyLevel) => {
          const option = document.createElement("option");
          option.value = difficultyLevel.difficult_level_id;
          option.textContent = difficultyLevel.difficult_level_text;
          difficultyLevelSelect.appendChild(option);
        });

        // Set giá trị mặc định hoặc giữ giá trị đang chọn nếu hợp lệ
        if (
          !this.selectedDifficultyId ||
          !difficultyLevels.some(
            (d) => d.difficult_level_id == this.selectedDifficultyId
          )
        ) {
          this.selectedDifficultyId = difficultyLevels[0].difficult_level_id; // Chọn cái đầu tiên
        }
      } catch (error) {
        // Lỗi đã được xử lý trong fetchDifficultyLevels
        difficultyLevelSelect.innerHTML =
          '<option value="" disabled>-- Lỗi tải độ khó --</option>';
        this.selectedDifficultyId = null;
      }
    },
    openAddDifficultyPopup() {
      this.DifficultyLevelText = ""; // Reset input
      this.addDifficultyError = ""; // Reset lỗi
      this.showAddDifficultyPopup = true;
      this.$nextTick(() => {
        document.getElementById("difficulty_level_text")?.focus();
      });
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
        const newDifficulty = response.data; // Giả sử API trả về object độ khó mới { difficult_level_id: ..., difficult_level_text: ... }
        this.closeAddDifficultyPopup();
        this.successMessage = `Đã thêm độ khó "${this.DifficultyLevelText}"!`;

        // Quan trọng: Tải lại danh sách độ khó và chọn cái mới
        await this.loadDifficultyLevels(); // Đợi tải lại xong

        // Chọn độ khó vừa thêm
        if (newDifficulty && newDifficulty.difficult_level_id) {
          this.selectedDifficultyId = newDifficulty.difficult_level_id;
        } else {
          // Fallback nếu API không trả về ID
          const addedDifficulty = this.difficultyLevels.find(
            (diff) =>
              diff.difficult_level_text === this.DifficultyLevelText.trim()
          );
          if (addedDifficulty) {
            this.selectedDifficultyId = addedDifficulty.difficult_level_id;
          } else if (this.difficultyLevels.length > 0) {
            this.selectedDifficultyId =
              this.difficultyLevels[
                this.difficultyLevels.length - 1
              ].difficult_level_id;
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
          this.addDifficultyError = `Lỗi máy chủ: ${error.response.status}`;
        } else {
          this.addDifficultyError =
            "Đã xảy ra lỗi mạng hoặc lỗi không xác định.";
        }
      }
    },
    // --- Kết thúc phương thức cho Độ khó ---
  },
};
</script>

<style src="./../../public/style.css"></style>
