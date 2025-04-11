<template>
  <div class="exam-container">
    <h2 class="exam-title">
      {{ isEditing ? "Chỉnh sửa Đề thi" : "Tạo Đề thi Mới" }}
    </h2>
    <form
      @submit.prevent="saveExamDetails"
      class="exam-form basic-details-form"
    >
      <div class="form-row">
        <div class="form-group half-width">
          <label for="exam_name" class="form-label">Tên Đề Thi:</label>
          <input
            type="text"
            id="exam_name"
            v-model="exam.exam_name"
            required
            class="form-input"
          />
        </div>
        <div class="form-group half-width with-add-button">
          <label for="category_id" class="form-label">Danh Mục:</label>
          <div class="select-with-button">
            <select
              id="category_id"
              v-model="exam.category_id"
              required
              class="form-select"
            >
              <option value="" disabled>-- Chọn danh mục --</option>
              <option
                v-for="cat in categories"
                :key="cat.category_id"
                :value="cat.category_id"
              >
                {{ cat.category_name }}
              </option>
            </select>
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
      <div class="form-group">
        <label for="description" class="form-label">Mô tả:</label>
        <textarea
          id="description"
          v-model="exam.description"
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>
    </form>

    <hr class="separator" />

    <div class="question-management">
      <h3 class="section-title">Quản lý Câu hỏi cho Đề thi</h3>

      <div class="search-area card">
        <h4>Tìm & Thêm Câu hỏi có sẵn</h4>
        <div class="form-row">
          <div class="form-group third-width">
            <label for="search_category" class="form-label"
              >Theo danh mục:</label
            >
            <select
              id="search_category"
              v-model="searchCriteria.categoryId"
              class="form-select"
            >
              <option value="">Tất cả</option>
              <option
                v-for="cat in categories"
                :key="cat.category_id"
                :value="cat.category_id"
              >
                {{ cat.category_name }}
              </option>
            </select>
          </div>
          <div class="form-group third-width">
            <label for="search_id" class="form-label">Theo ID câu hỏi:</label>
            <input
              type="number"
              id="search_id"
              v-model.number="searchCriteria.questionId"
              class="form-input"
              placeholder="Nhập ID..."
            />
          </div>
          <div class="form-group third-width">
            <label for="search_text" class="form-label">Theo nội dung:</label>
            <input
              type="text"
              id="search_text"
              v-model="searchCriteria.text"
              class="form-input"
              placeholder="Nhập từ khóa..."
            />
          </div>
        </div>
        <button
          @click="searchQuestions"
          :disabled="isLoadingSearch"
          class="action-btn search-btn"
        >
          <span v-if="isLoadingSearch">Đang tìm...</span>
          <span v-else>Tìm kiếm</span>
        </button>

        <div v-if="searchResults.length > 0" class="search-results">
          <h5>Kết quả tìm kiếm:</h5>
          <ul>
            <li
              v-for="q in searchResults"
              :key="q.question_id"
              class="search-result-item"
            >
              <span
                >{{ q.question_id }} -
                {{ q.question_text.substring(0, 100) }}... ({{
                  q.category?.category_name
                }})</span
              >
              <button
                @click="addQuestionToExamList(q)"
                :disabled="isQuestionAdded(q.question_id)"
                class="add-btn small-btn"
              >
                {{ isQuestionAdded(q.question_id) ? "Đã thêm" : "Thêm" }}
              </button>
            </li>
          </ul>
        </div>
        <p
          v-if="
            !isLoadingSearch && searchPerformed && searchResults.length === 0
          "
        >
          Không tìm thấy câu hỏi nào.
        </p>
      </div>

      <div class="added-questions-area card">
        <h4>Câu hỏi trong Đề thi ({{ addedQuestions.length }})</h4>
        <ul v-if="addedQuestions.length > 0">
          <li
            v-for="(eq, index) in addedQuestions"
            :key="eq.question_id"
            class="added-question-item"
          >
            <span
              >{{ index + 1 }}. [ID: {{ eq.question_id }}]
              {{ eq.question_text.substring(0, 100) }}... ({{
                getDifficultyText(eq.difficult_level_id)
              }})</span
            >
            <button
              @click="removeQuestionFromExamList(index)"
              class="remove-btn small-btn"
            >
              &times;
            </button>
          </li>
        </ul>
        <p v-else>Chưa có câu hỏi nào được thêm vào đề thi.</p>
      </div>
    </div>

    <hr class="separator" />

    <div class="difficulty-management">
      <h3 class="section-title">Phân bổ Số lượng Câu hỏi theo Độ khó</h3>
      <div v-if="addedQuestions.length === 0" class="info-message">
        Vui lòng thêm câu hỏi vào đề thi trước khi phân bổ độ khó.
      </div>
      <div v-else class="difficulty-controls card">
        <h4>Thêm/Cập nhật Độ khó</h4>
        <div class="form-row">
          <div class="form-group half-width with-add-button">
            <label for="link_difficulty_id" class="form-label"
              >Chọn độ khó:</label
            >
            <div class="select-with-button">
              <select
                id="link_difficulty_id"
                v-model="currentDifficultyLink.difficult_level_id"
                class="form-select"
              >
                <option value="" disabled>-- Chọn độ khó --</option>
                <option
                  v-for="level in difficultyLevels"
                  :key="level.difficult_level_id"
                  :value="level.difficult_level_id"
                >
                  {{ level.difficult_level_text }} (Hiện có:
                  {{
                    availableQuestionsCountByDifficulty[
                      level.difficult_level_id
                    ] || 0
                  }})
                </option>
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
            <label for="link_question_count" class="form-label"
              >Số lượng câu hỏi:</label
            >
            <input
              type="number"
              id="link_question_count"
              v-model.number="currentDifficultyLink.question_count"
              :max="maxQuestionsForSelectedDifficulty"
              min="0"
              class="form-input"
              :disabled="!currentDifficultyLink.difficult_level_id"
              placeholder="Nhập số lượng"
            />
            <small
              v-if="currentDifficultyLink.difficult_level_id"
              class="input-hint"
            >
              Tối đa: {{ maxQuestionsForSelectedDifficulty }} câu
            </small>
          </div>
        </div>
        <button
          @click="addOrUpdateDifficultyLink"
          :disabled="
            !currentDifficultyLink.difficult_level_id ||
            currentDifficultyLink.question_count === null ||
            currentDifficultyLink.question_count < 0 ||
            currentDifficultyLink.question_count >
              maxQuestionsForSelectedDifficulty
          "
          class="action-btn"
        >
          {{ getButtonTextForDifficultyLink() }}
        </button>

        <div
          v-if="examDifficultyLinks.length > 0"
          class="added-difficulties-list"
        >
          <h5>Độ khó đã thiết lập:</h5>
          <ul>
            <li
              v-for="(link, index) in examDifficultyLinks"
              :key="link.difficult_level_id"
            >
              <span
                >{{ getDifficultyText(link.difficult_level_id) }}:
                {{ link.question_count }} câu hỏi</span
              >
              <div class="list-item-actions">
                <button
                  @click="editDifficultyLink(link)"
                  class="edit-btn small-btn"
                >
                  Sửa
                </button>
                <button
                  @click="removeDifficultyLink(index)"
                  class="remove-btn small-btn"
                >
                  &times;
                </button>
              </div>
            </li>
          </ul>
          <p class="total-difficulty-count">
            Tổng số câu hỏi đã phân bổ: {{ totalAllocatedQuestions }} /
            {{ addedQuestions.length }}
          </p>
        </div>
      </div>
    </div>

    <hr class="separator" />

    <div class="form-actions main-actions">
      <button @click="saveExam" :disabled="isSaving" class="submit-btn">
        <span v-if="isSaving">Đang lưu...</span>
        <span v-else>{{ isEditing ? "Cập nhật Đề thi" : "Tạo Đề thi" }}</span>
      </button>
    </div>

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
        <form @submit.prevent="submitNewDifficultyLevel" class="popup-form">
          <div class="form-group">
            <label for="difficulty_level_text" class="form-label"
              >Tên độ khó:</label
            >
            <input
              type="text"
              id="difficulty_level_text"
              v-model="newDifficultyLevelText"
              required
              class="form-input"
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
      ✓ {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">! {{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateExamView",
  data() {
    return {
      // Exam Details
      exam: {
        exam_id: null, // ID của exam nếu đang sửa
        exam_name: "",
        description: "",
        category_id: "",
      },
      categories: [],
      showAddCategoryPopup: false,
      newCategoryName: "",
      newCategoryDescription: "",
      addCategoryError: "",

      // Question Management
      searchCriteria: {
        categoryId: "",
        questionId: null,
        text: "",
      },
      searchResults: [],
      isLoadingSearch: false,
      searchPerformed: false, // Cờ để biết đã tìm kiếm hay chưa
      addedQuestions: [], // Danh sách các object câu hỏi đầy đủ { question_id, question_text, difficult_level_id, ... }

      // Difficulty Management
      difficultyLevels: [],
      showAddDifficultyPopup: false,
      newDifficultyLevelText: "",
      addDifficultyError: "",
      // Danh sách liên kết độ khó cho exam này { difficult_level_id, question_count }
      examDifficultyLinks: [],
      // Dữ liệu tạm thời cho form thêm/sửa link độ khó
      currentDifficultyLink: {
        difficult_level_id: "",
        question_count: null, // Bắt đầu là null để phân biệt chưa nhập
      },

      // Component State
      isSaving: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  computed: {
    isEditing() {
      return !!this.exam.exam_id;
    },
 
    // Tính toán số lượng câu hỏi thực tế cho mỗi độ khó dựa trên addedQuestions
    availableQuestionsCountByDifficulty() {
      const counts = {};
      for (const q of this.addedQuestions) {
        if (q.difficult_level_id) {
          counts[q.difficult_level_id] =
            (counts[q.difficult_level_id] || 0) + 1;
        }
      }
      return counts;
    },
    // Số lượng câu hỏi tối đa có thể nhập cho độ khó đang chọn
    maxQuestionsForSelectedDifficulty() {
      if (!this.currentDifficultyLink.difficult_level_id) return 0;
      return (
        this.availableQuestionsCountByDifficulty[
          this.currentDifficultyLink.difficult_level_id
        ] || 0
      );
    },
    // Tổng số câu hỏi đã được phân bổ vào các độ khó
    totalAllocatedQuestions() {
      return this.examDifficultyLinks.reduce(
        (sum, link) => sum + (link.question_count || 0),
        0
      );
    },
  },
  
  async created() {
    // Đọc examId từ query parameter thay vì prop
    if(this.examIdToEid)  {
      this.exam.exam_id = this.examIdToEid;
    }
    const examId = this.$route.query.examId;
    if (examId) {
      this.exam.exam_id = examId;
     await this.loadExamDataForEdit();
      this.loadCategories(); // Tải danh mục ngay cả khi đang sửa
      this.loadDifficultyLevels
      
    }
  },
  mounted() {
    this.loadInitialData();
  },
  methods: {
    async loadInitialData() {
      await this.loadCategories();
      await this.loadDifficultyLevels();
      if (this.isEditing) {
        await this.loadExamDataForEdit();
      }
      // Set giá trị mặc định cho category nếu chưa có (sau khi load)
      if (!this.exam.category_id && this.categories.length > 0) {
        this.exam.category_id = this.categories[0].category_id;
      }
    },

    // --- Exam Details Methods ---
    async loadExamDataForEdit() {
      if (!this.exam.exam_id) return;
      this.isSaving = true; // Show loading state
      try {
        const token = localStorage.getItem("token");
        console.log("token", token);
        if (!token) {
          throw new Error("Không tìm thấy token xác thực");
        }
        // 1. Fetch Exam Details
        const examRes = await axios.get(`/api/exams/${this.exam.exam_id}`);
        this.exam = examRes.data; // Cập nhật data exam

        // 2. Fetch Added Questions (Giả sử có endpoint lấy ExamQuestion links cho exam)
        // Endpoint này cần trả về danh sách ExamQuestion kèm chi tiết Question
        // const questionsRes = await axios.get(
        //   `/api/exam-questions/for-exam/${this.exam.exam_id}`,
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        // // Cần lấy ra object Question đầy đủ từ response
        // this.addedQuestions = questionsRes.data
        //   .map((eq) => eq.question)
        //   .filter((q) => q); // Lấy question object từ link

       // 3. Fetch Difficulty Links (Giả sử có endpoint lấy ExamDifficulty links cho exam)
        // const difficultyRes = await axios.get(
        //   `/api/exam-difficulties/by-exam/${this.exam.exam_id}`,
        //   { headers: { Authorization: `Bearer ${token}` } }
        // ); // Giả sử endpoint này tồn tại
        // this.examDifficultyLinks = difficultyRes.data || [];

        // this.successMessage = "Đã tải dữ liệu đề thi.";
        setTimeout(() => (this.successMessage = ""), 3000);
      } catch (error) {
        this.handleApiError(
          error,
          `tải dữ liệu đề thi ID ${this.exam.exam_id}`
        );
      } finally {
        this.isSaving = false;
      }
    },
    async saveExamDetails() {
      // Hàm này có thể dùng để lưu chi tiết cơ bản nếu form tách biệt
      // Hoặc logic này sẽ nằm trong hàm saveExam() chính
      console.log("Saving basic details (placeholder)...", this.exam);
      // Gọi API POST hoặc PUT /api/exams
      this.showTemporarySuccess("Đã lưu chi tiết cơ bản (placeholder).");
    },

    // --- Category Methods ---
    async loadCategories() {
      // (Giống CreateQuestionView, nhưng lưu vào this.categories)
      try {
        const response = await axios.get("/api/categories");
        this.categories = response.data || [];
        // Set giá trị mặc định nếu đang tạo mới và chưa có giá trị
        if (
          !this.isEditing &&
          !this.exam.category_id &&
          this.categories.length > 0
        ) {
          this.exam.category_id = this.categories[0].category_id;
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        this.showTemporaryError("Không thể tải danh sách danh mục.");
        this.categories = [];
      }
    },
    openAddCategoryPopup() {
      /* (Giống CreateQuestionView) */
      this.newCategoryName = "";
      this.newCategoryDescription = "";
      this.addCategoryError = "";
      this.showAddCategoryPopup = true;
      this.$nextTick(() => {
        document.getElementById("new_category_name")?.focus();
      });
    },
    closeAddCategoryPopup() {
      /* (Giống CreateQuestionView) */
      this.showAddCategoryPopup = false;
    },
    async submitNewCategory() {
      /* (Giống CreateQuestionView, nhưng load lại this.categories và set this.exam.category_id) */
      if (!this.newCategoryName.trim()) {
        this.addCategoryError = "Vui lòng nhập tên danh mục.";
        return;
      }
      this.addCategoryError = "";
      try {
        const token = localStorage.getItem("token");
        const payload = {
          category_name: this.newCategoryName.trim(),
          description: this.newCategoryDescription.trim(),
        };
        const response = await axios.post("/api/categories", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newCategory = response.data;
        this.closeAddCategoryPopup();
        this.showTemporarySuccess(
          `Đã thêm danh mục "${this.newCategoryName}"!`
        );
        await this.loadCategories(); // Tải lại danh sách
        if (newCategory && newCategory.category_id) {
          // Chọn cái mới thêm
          this.exam.category_id = newCategory.category_id;
        }
      } catch (error) {
        this.handlePopupError(error, this.addCategoryError, "thêm danh mục");
      }
    },

    // --- Question Management Methods ---
    async searchQuestions() {
      this.isLoadingSearch = true;
      this.searchPerformed = true; // Đánh dấu đã tìm kiếm
      this.searchResults = [];
      try {
        // Xây dựng params dựa trên criteria
        const params = {};
        if (this.searchCriteria.categoryId)
          params.category_id = this.searchCriteria.categoryId;
        if (this.searchCriteria.questionId)
          params.id = this.searchCriteria.questionId; // Giả sử API hỗ trợ tìm theo ID
        if (this.searchCriteria.text) params.q = this.searchCriteria.text; // Giả sử API dùng 'q' cho tìm kiếm text

        // Gọi API tìm kiếm câu hỏi (Giả sử endpoint là /api/questions/search)
        const response = await axios.get("/api/questions/", { params });
        this.searchResults = response.data || [];
      } catch (error) {
        this.handleApiError(error, "tìm kiếm câu hỏi");
      } finally {
        this.isLoadingSearch = false;
      }
    },
    addQuestionToExamList(question) {
      if (!this.isQuestionAdded(question.question_id)) {
        // Cần lấy đủ thông tin question, đặc biệt là difficult_level_id
        // Nếu API search chưa trả về đủ, cần gọi API getQuestionById
        this.addedQuestions.push(question);
        this.showTemporarySuccess(`Đã thêm câu hỏi ID ${question.question_id}`);
      }
    },
    removeQuestionFromExamList(index) {
      const removedQuestion = this.addedQuestions.splice(index, 1)[0];
      this.showTemporarySuccess(
        `Đã xóa câu hỏi ID ${removedQuestion.question_id}`
      );
      // Cần gọi API để xóa liên kết trong DB khi lưu exam
    },
    isQuestionAdded(questionId) {
      return this.addedQuestions.some((q) => q.question_id === questionId);
    },

    // --- Difficulty Management Methods ---
    async loadDifficultyLevels() {
      // (Giống CreateQuestionView, nhưng lưu vào this.difficultyLevels)
      try {
        const response = await axios.get("/api/difficulty-level"); // API lấy danh sách độ khó
        this.difficultyLevels = response.data || [];
      } catch (error) {
        console.error("Lỗi khi lấy độ khó:", error);
        this.showTemporaryError("Không thể tải danh sách độ khó.");
        this.difficultyLevels = [];
      }
    },
    openAddDifficultyPopup() {
      /* (Giống CreateQuestionView) */
      this.newDifficultyLevelText = "";
      this.addDifficultyError = "";
      this.showAddDifficultyPopup = true;
      this.$nextTick(() => {
        document.getElementById("difficulty_level_text")?.focus();
      });
    },
    closeAddDifficultyPopup() {
      /* (Giống CreateQuestionView) */
      this.showAddDifficultyPopup = false;
    },
    async submitNewDifficultyLevel() {
      /* (Giống CreateQuestionView, nhưng gọi loadDifficultyLevels) */
      if (!this.newDifficultyLevelText.trim()) {
        this.addDifficultyError = "Vui lòng nhập tên độ khó.";
        return;
      }
      this.addDifficultyError = "";
      try {
        const token = localStorage.getItem("token");
        const payload = {
          difficult_level_text: this.newDifficultyLevelText.trim(),
        };
        // API endpoint để tạo difficulty level mới
        await axios.post("/api/difficulty-level", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // const newDifficulty = response.data;
        this.closeAddDifficultyPopup();
        this.showTemporarySuccess(
          `Đã thêm độ khó "${this.newDifficultyLevelText}"!`
        );
        await this.loadDifficultyLevels(); // Tải lại
        // Có thể tự động chọn độ khó mới thêm vào form link nếu muốn
        // if (newDifficulty && newDifficulty.difficult_level_id) {
        //     this.currentDifficultyLink.difficult_level_id = newDifficulty.difficult_level_id;
        // }
      } catch (error) {
        this.handlePopupError(error, this.addDifficultyError, "thêm độ khó");
      }
    },
    addOrUpdateDifficultyLink() {
      const levelId = this.currentDifficultyLink.difficult_level_id;
      const count = this.currentDifficultyLink.question_count;

      // Validation cơ bản
      if (!levelId || count === null || count < 0) {
        this.showTemporaryError(
          "Vui lòng chọn độ khó và nhập số lượng hợp lệ."
        );
        return;
      }
      if (count > this.maxQuestionsForSelectedDifficulty) {
        this.showTemporaryError(
          `Số lượng không được vượt quá số câu hỏi có độ khó này (${this.maxQuestionsForSelectedDifficulty}).`
        );
        return;
      }

      const existingLinkIndex = this.examDifficultyLinks.findIndex(
        (link) => link.difficult_level_id === levelId
      );

      if (existingLinkIndex > -1) {
        // Update existing
        this.examDifficultyLinks[existingLinkIndex].question_count = count;
        this.showTemporarySuccess(
          `Đã cập nhật độ khó "${this.getDifficultyText(levelId)}".`
        );
      } else {
        // Add new
        this.examDifficultyLinks.push({ ...this.currentDifficultyLink });
        this.showTemporarySuccess(
          `Đã thêm độ khó "${this.getDifficultyText(levelId)}".`
        );
      }

      // Reset form thêm/sửa link
      this.currentDifficultyLink = {
        difficult_level_id: "",
        question_count: null,
      };
      // Cần gọi API để lưu thay đổi khi lưu exam
    },
    editDifficultyLink(linkToEdit) {
      // Load dữ liệu của link vào form để sửa
      this.currentDifficultyLink = { ...linkToEdit }; // Tạo bản sao để tránh binding trực tiếp
    },
    removeDifficultyLink(index) {
      const removedLink = this.examDifficultyLinks.splice(index, 1)[0];
      this.showTemporarySuccess(
        `Đã xóa độ khó "${this.getDifficultyText(
          removedLink.difficult_level_id
        )}".`
      );
      // Cần gọi API để xóa link trong DB khi lưu exam
    },
    getDifficultyText(levelId) {
      const level = this.difficultyLevels.find(
        (l) => l.difficult_level_id === levelId
      );
      return level ? level.difficult_level_text : "Không xác định";
    },
    getButtonTextForDifficultyLink() {
      const levelId = this.currentDifficultyLink.difficult_level_id;
      if (!levelId) return "Thêm/Cập nhật"; // Hoặc disable nút
      const exists = this.examDifficultyLinks.some(
        (link) => link.difficult_level_id === levelId
      );
      return exists ? "Cập nhật Số lượng" : "Thêm Độ khó";
    },

    // --- Main Save Method ---
    async saveExam() {
      this.isSaving = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Lỗi xác thực.");

        let currentExamId = this.exam.exam_id;

        // Bước 1: Tạo hoặc Cập nhật Exam cơ bản
        const examPayload = {
          exam_name: this.exam.exam_name,
          description: this.exam.description,
          category_id: this.exam.category_id,
        };

        let examResponse;
        if (this.isEditing) {
          console.log(
            "Updating exam:",
            `/api/exams/${currentExamId}`,
            examPayload
          );
          examResponse = await axios.put(
            `/api/exams/${currentExamId}`,
            examPayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          console.log("Creating exam:", "/api/exams", examPayload);
          examResponse = await axios.post("/api/exams", examPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          currentExamId = examResponse.data.exam_id; // Lấy ID của exam vừa tạo
          this.exam.exam_id = currentExamId; // Cập nhật ID cho component state
          console.log("Exam created with ID:", currentExamId);
        }

        if (!currentExamId) {
          throw new Error(
            "Không thể lấy được ID của đề thi sau khi tạo/cập nhật."
          );
        }

        // Bước 2: Cập nhật liên kết Exam-Question
        // Lấy danh sách ID câu hỏi hiện tại
        const currentQuestionIds = this.addedQuestions.map(
          (q) => q.question_id
        );
        console.log(
          "Updating questions for exam:",
          currentExamId,
          " with IDs:",
          currentQuestionIds
        );
        // ** Cần API endpoint để SET/REPLACE danh sách câu hỏi cho exam **
        // Ví dụ: PUT /api/exams/:examId/questions với body là { questionIds: [...] }
        // Hoặc dùng bulk add/remove của ExamQuestion router (phức tạp hơn để đồng bộ)
        // Tạm thời giả sử có API PUT /api/exams/:examId/set-questions
        await axios.put(
          `/api/exams/${currentExamId}/set-questions`,
          { questionIds: currentQuestionIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Questions updated for exam:", currentExamId);

        // Bước 3: Cập nhật liên kết Exam-Difficulty
        console.log(
          "Updating difficulty links for exam:",
          currentExamId,
          " with data:",
          this.examDifficultyLinks
        );
        // ** Cần API endpoint để SET/REPLACE danh sách difficulty links cho exam **
        // Ví dụ: PUT /api/exams/:examId/difficulty-links với body là [{difficult_level_id: ..., question_count: ...}, ...]
        // Hoặc dùng API của ExamDifficulty router (POST/PUT/DELETE từng link) - kém hiệu quả hơn
        // Tạm thời giả sử có API PUT /api/exams/:examId/set-difficulty-links
        await axios.put(
          `/api/exams/${currentExamId}/set-difficulty-links`,
          { links: this.examDifficultyLinks },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Difficulty links updated for exam:", currentExamId);

        this.showTemporarySuccess(
          `Đề thi đã được ${this.isEditing ? "cập nhật" : "tạo"} thành công!`
        );

        // Optional: Chuyển hướng người dùng sau khi lưu thành công
        // this.$router.push('/admin/exams'); // Ví dụ
      } catch (error) {
        this.handleApiError(
          error,
          this.isEditing ? "cập nhật đề thi" : "tạo đề thi"
        );
      } finally {
        this.isSaving = false;
      }
    },

    // --- Helper Methods ---
    showTemporarySuccess(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = "";
      }, 3000);
    },
    showTemporaryError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = "";
      }, 3000);
    },
    handleApiError(error, contextAction) {
      // (Giống CreateQuestionView)
      this.errorMessage = `Đã xảy ra lỗi khi ${contextAction}.`;
      if (error.response) {
        this.errorMessage += ` Status: ${error.response.status}.`;
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) this.errorMessage += ` Chi tiết: ${backendError}`;
      } else if (error.request) {
        this.errorMessage += " Lỗi kết nối mạng.";
      } else {
        this.errorMessage += ` Lỗi: ${error.message}`;
      }
      console.error(`Lỗi khi ${contextAction}:`, error);
    },
    handlePopupError(error, errorDataProperty, contextAction) {
      console.error(`Lỗi khi ${contextAction}:`, error);
      if (error.response?.data?.message) {
        this[errorDataProperty] = `Lỗi: ${error.response.data.message}`;
      } else if (error.response?.status) {
        this[errorDataProperty] = `Lỗi máy chủ: ${error.response.status}`;
      } else {
        this[errorDataProperty] = "Lỗi mạng hoặc lỗi không xác định.";
      }
    },
  },
};
</script>

<style scoped>
/* Thêm CSS scoping hoặc import file CSS chung */
/* Ví dụ: */
@import "./../../public/style.css"; /* Hoặc đường dẫn tới file CSS của bạn */
</style>
