// src/controllers/exam_difficulty.controller.js
const examDiffService = require("../services/exam_difficulty.service"); // Import service tương ứng

// Đã loại bỏ helper function parseIntOrThrow

// 1. Lấy tất cả các liên kết Exam-Difficulty
exports.getAllExamDifficulties = async (req, res) => {
  try {
    const examDifficulties = await examDiffService.getAllExamDifficulties();
    res.json(examDifficulties);
  } catch (error) {
    console.error("Error in getAllExamDifficulties controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 2. Lấy một liên kết Exam-Difficulty cụ thể bằng khóa phức hợp
// Yêu cầu route dạng: /exams/:examId/difficulties/:diffLevelId (ví dụ)
exports.getExamDifficultyByCompositeId = async (req, res) => {
  try {
    // Parse và kiểm tra ID từ params trực tiếp
    const examIdParam = req.params.examId;
    const diffLevelIdParam = req.params.diffLevelId;

    const examId = parseInt(examIdParam, 10);
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    const examDifficulty = await examDiffService.getExamDifficultyByCompositeId(
      examId,
      diffLevelId
    );

    if (!examDifficulty) {
      return res
        .status(404)
        .json({ message: "Exam-Difficulty association not found" });
    }
    res.json(examDifficulty);
  } catch (error) {
    console.error("Error in getExamDifficultyByCompositeId controller:", error);
    // Lỗi 400 đã được xử lý ở trên, đây chủ yếu là lỗi 500 hoặc lỗi từ service
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 3. Tạo một liên kết Exam-Difficulty mới
exports.createExamDifficulty = async (req, res) => {
  try {
    // Dữ liệu cần thiết: exam_id, difficult_level_id, question_count
    const { exam_id, difficult_level_id, question_count } = req.body;

    // Validation cơ bản ở controller (Service cũng nên có validation)
    if (
      exam_id === undefined ||
      difficult_level_id === undefined ||
      question_count === undefined
    ) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: exam_id, difficult_level_id, question_count",
        });
    }
    if (typeof exam_id !== "number" || !Number.isInteger(exam_id)) {
      return res
        .status(400)
        .json({ message: "Invalid value for exam_id. It must be an integer." });
    }
    if (
      typeof difficult_level_id !== "number" ||
      !Number.isInteger(difficult_level_id)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for difficult_level_id. It must be an integer.",
        });
    }
    if (
      typeof question_count !== "number" ||
      !Number.isInteger(question_count) ||
      question_count < 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for question_count. It must be a non-negative integer.",
        });
    }

    const newExamDifficulty = await examDiffService.createExamDifficulty({
      exam_id,
      difficult_level_id,
      question_count,
    });

    // Trả về bản ghi vừa tạo với status 201 Created
    res.status(201).json(newExamDifficulty);
  } catch (error) {
    console.error("Error in createExamDifficulty controller:", error);
    // Xử lý các lỗi cụ thể từ service (ví dụ: trùng khóa, khóa ngoại sai)
    if (
      error.message.includes("already exists") ||
      error.message.includes("Invalid Exam ID or Difficulty Level ID")
    ) {
      // Service nên trả về lỗi rõ ràng hơn, hoặc controller kiểm tra trước khi gọi service
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({
        message:
          error.message ||
          "An unexpected error occurred while creating the association.",
      });
  }
};

// 4. Cập nhật liên kết Exam-Difficulty (thường là cập nhật question_count)
// Yêu cầu route dạng: /exams/:examId/difficulties/:diffLevelId (ví dụ)
exports.updateExamDifficulty = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const diffLevelIdParam = req.params.diffLevelId;
    const { question_count } = req.body; // Chỉ lấy trường cần cập nhật

    const examId = parseInt(examIdParam, 10);
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    // Validation
    if (question_count === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required field for update: question_count" });
    }
    if (
      typeof question_count !== "number" ||
      !Number.isInteger(question_count) ||
      question_count < 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for question_count. It must be a non-negative integer.",
        });
    }

    const updatedExamDifficulty = await examDiffService.updateExamDifficulty(
      examId,
      diffLevelId,
      { question_count } // Chỉ gửi dữ liệu cần cập nhật
    );

    if (!updatedExamDifficulty) {
      return res
        .status(404)
        .json({ message: "Exam-Difficulty association not found for update" });
    }

    res.json(updatedExamDifficulty); // Trả về bản ghi đã cập nhật
  } catch (error) {
    console.error("Error in updateExamDifficulty controller:", error);
    // Lỗi 400 (validation) đã được xử lý ở trên
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 5. Xóa một liên kết Exam-Difficulty
// Yêu cầu route dạng: /exams/:examId/difficulties/:diffLevelId (ví dụ)
exports.deleteExamDifficulty = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const diffLevelIdParam = req.params.diffLevelId;

    const examId = parseInt(examIdParam, 10);
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    const result = await examDiffService.deleteExamDifficulty(
      examId,
      diffLevelId
    );

    if (!result.success) {
      // Service trả về message 'ExamDifficulty record not found'
      return res.status(404).json({ message: result.message });
    }

    // Thành công, trả về 204 No Content
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteExamDifficulty controller:", error);
    // Lỗi 400 (validation) đã được xử lý ở trên
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 6. Lấy tất cả mức độ khó và số lượng câu hỏi cho một Exam cụ thể
// Yêu cầu route dạng: /exams/:examId/difficulties (ví dụ)
exports.getDifficultiesForExam = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const examId = parseInt(examIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }

    const difficulties = await examDiffService.getDifficultiesForExam(examId);
    res.json(difficulties); // Trả về danh sách tìm được (có thể rỗng)
  } catch (error) {
    console.error("Error in getDifficultiesForExam controller:", error);
    // Lỗi 400 (validation) đã được xử lý ở trên
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 7. Lấy tất cả các bài thi sử dụng một Mức độ khó cụ thể
// Yêu cầu route dạng: /difficulty-levels/:diffLevelId/exams (ví dụ)
exports.getExamsForDifficulty = async (req, res) => {
  try {
    const diffLevelIdParam = req.params.diffLevelId;
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    const exams = await examDiffService.getExamsForDifficulty(diffLevelId);
    res.json(exams); // Trả về danh sách tìm được (có thể rỗng)
  } catch (error) {
    console.error("Error in getExamsForDifficulty controller:", error);
    // Lỗi 400 (validation) đã được xử lý ở trên
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};
