// src/routes/exam_difficulty.router.js
const express = require("express");
const examDiffController = require("../controllers/exam_difficulty.controller"); // Import controller tương ứng
const authMiddleware = require("../middlewares/auth.middleware"); // Giả sử có middleware này
const adminMiddleware = require("../middlewares/admin.middleware"); // Giả sử có middleware này
const { body, validationResult } = require("express-validator"); // Import body và validationResult

const router = express.Router();

// --- Middleware kiểm tra lỗi validation đơn giản (nếu không muốn tạo file riêng) ---
// Hoặc bỏ qua middleware này và để controller tự xử lý lỗi 400/500
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // Chỉ trả về lỗi đầu tiên cho đơn giản
  const firstError = errors.array()[0];
  return res
    .status(400)
    .json({ message: `${firstError.param}: ${firstError.msg}` }); // 400 Bad Request
};

// --- Định nghĩa các Route cho ExamDifficulty ---

// 1. GET Lấy tất cả các liên kết Exam-Difficulty
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  examDiffController.getAllExamDifficulties
);

// 2. POST Tạo một liên kết Exam-Difficulty mới
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    // Validation cho body request
    body("exam_id")
      .notEmpty()
      .withMessage("Exam ID is required")
      .isInt({ gt: 0 })
      .withMessage("Exam ID must be a positive integer"),
    body("difficult_level_id")
      .notEmpty()
      .withMessage("Difficulty Level ID is required")
      .isInt({ gt: 0 })
      .withMessage("Difficulty Level ID must be a positive integer"),
    body("question_count")
      .notEmpty()
      .withMessage("Question count is required")
      .isInt({ min: 0 })
      .withMessage("Question count must be a non-negative integer"),
  ],
  handleValidationErrors, // Xử lý lỗi validation body trước khi vào controller
  examDiffController.createExamDifficulty
);

// 3. GET Lấy một liên kết cụ thể bằng khóa phức hợp (examId, diffLevelId)
// Controller sẽ xử lý validation param
router.get(
  "/:examId/:diffLevelId", // Sử dụng cả hai ID trong path
  authMiddleware,
  adminMiddleware,
  // Đã bỏ param validation ở đây
  examDiffController.getExamDifficultyByCompositeId
);

// 4. PUT Cập nhật một liên kết (thường là question_count)
// Controller sẽ xử lý validation param
router.put(
  "/:examId/:diffLevelId",
  authMiddleware,
  adminMiddleware,
  [
    // Chỉ validate body
    body("question_count")
      .notEmpty()
      .withMessage("Question count is required")
      .isInt({ min: 0 })
      .withMessage("Question count must be a non-negative integer"),
  ],
  handleValidationErrors, // Xử lý lỗi validation body
  examDiffController.updateExamDifficulty
);

// 5. DELETE Xóa một liên kết
// Controller sẽ xử lý validation param
router.delete(
  "/:examId/:diffLevelId",
  authMiddleware,
  adminMiddleware,
  // Đã bỏ param validation ở đây
  examDiffController.deleteExamDifficulty
);

// --- Các route tiện ích (lấy danh sách dựa trên một khóa ngoại) ---

// 6. GET Lấy danh sách mức độ khó và số câu hỏi cho một Exam cụ thể
// Controller sẽ xử lý validation param
router.get(
  "/by-exam/:examId", // Route rõ ràng hơn
  authMiddleware,
  adminMiddleware,
  // Đã bỏ param validation ở đây
  examDiffController.getDifficultiesForExam
);

// 7. GET Lấy danh sách các Exam sử dụng một mức độ khó cụ thể
// Controller sẽ xử lý validation param
router.get(
  "/by-difficulty/:diffLevelId", // Route rõ ràng hơn
  authMiddleware,
  adminMiddleware,
  // Đã bỏ param validation ở đây
  examDiffController.getExamsForDifficulty
);

module.exports = router;
