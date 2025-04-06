// src/routes/exam_question.router.js
const express = require("express");
const examQuestionController = require("../controllers/exam_question.controller"); // Import controller tương ứng
const authMiddleware = require("../middlewares/auth.middleware"); // Giả sử có middleware này
const adminMiddleware = require("../middlewares/admin.middleware"); // Giả sử có middleware này
const { body, validationResult } = require("express-validator"); // Import body và validationResult

const router = express.Router();

// --- Middleware kiểm tra lỗi validation đơn giản ---
// (Giống như trong examDiffRouter đã lược bỏ)
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const firstError = errors.array()[0];
  return res
    .status(400)
    .json({ message: `${firstError.param}: ${firstError.msg}` }); // 400 Bad Request
};

// --- Định nghĩa các Route cho ExamQuestion ---
// Base path cho CRUD cơ bản: /exam-questions

// 1. GET Lấy tất cả các liên kết Exam-Question (Yêu cầu Admin)
router.get(
  "/", // GET /exam-questions/
  authMiddleware,
  adminMiddleware,
  examQuestionController.getAllExamQuestions
);

// 2. POST Tạo một liên kết Exam-Question mới (Yêu cầu Admin)
router.post(
  "/", // POST /exam-questions/
  authMiddleware,
  adminMiddleware,
  [
    // Validation cho body request
    body("exam_id")
      .notEmpty()
      .withMessage("Exam ID is required")
      .isInt({ gt: 0 })
      .withMessage("Exam ID must be a positive integer"),
    body("question_id")
      .notEmpty()
      .withMessage("Question ID is required")
      .isInt({ gt: 0 })
      .withMessage("Question ID must be a positive integer"),
    body("question_order") // Optional
      .optional({ nullable: true }) // Cho phép null hoặc không có mặt
      .isInt({ min: 0 })
      .withMessage("Question order must be a non-negative integer"),
  ],
  handleValidationErrors, // Xử lý lỗi validation body
  examQuestionController.createExamQuestion
);

// 3. GET Lấy một liên kết cụ thể bằng ID (exam_question_id) (Yêu cầu Admin)
router.get(
  "/:id", // GET /exam-questions/:id
  authMiddleware,
  adminMiddleware,
  // Controller sẽ xử lý validation param :id
  examQuestionController.getExamQuestionById
);

// 4. PUT Cập nhật một liên kết (thường là question_order) (Yêu cầu Admin)
router.put(
  "/:id", // PUT /exam-questions/:id
  authMiddleware,
  adminMiddleware,
  [
    // Chỉ validate body nếu có question_order
    body("question_order")
      .optional({ nullable: true }) // Cho phép null hoặc không có mặt
      .isInt({ min: 0 })
      .withMessage("Question order must be a non-negative integer"),
  ],
  handleValidationErrors, // Xử lý lỗi validation body
  // Controller sẽ xử lý validation param :id
  examQuestionController.updateExamQuestion
);

// 5. DELETE Xóa một liên kết bằng ID (exam_question_id) (Yêu cầu Admin)
router.delete(
  "/:id", // DELETE /exam-questions/:id
  authMiddleware,
  adminMiddleware,
  // Controller sẽ xử lý validation param :id
  examQuestionController.deleteExamQuestion
);

// --- Các route lồng nhau và route xử lý hàng loạt ---

// 6. GET Lấy tất cả câu hỏi cho một Exam cụ thể (Yêu cầu User)
router.get(
  "/for-exam/:examId", // GET /exam-questions/for-exam/:examId
  authMiddleware, // Chỉ cần xác thực user là đủ
  // Controller sẽ xử lý validation param :examId
  examQuestionController.getQuestionsForExam
);

// 7. GET Lấy tất cả các bài thi sử dụng một Câu hỏi cụ thể (Yêu cầu Admin)
router.get(
  "/for-question/:questionId", // GET /exam-questions/for-question/:questionId
  authMiddleware,
  adminMiddleware,
  // Controller sẽ xử lý validation param :questionId
  examQuestionController.getExamsForQuestion
);

// 8. POST Thêm nhiều câu hỏi vào một bài thi (Yêu cầu Admin)
router.post(
  "/bulk/add-to-exam/:examId", // POST /exam-questions/bulk/add-to-exam/:examId
  authMiddleware,
  adminMiddleware,
  [
    // Validate body chứa mảng questionIds
    body("questionIds")
      .isArray({ min: 1 })
      .withMessage("questionIds must be a non-empty array")
      .custom((ids) => ids.every((id) => Number.isInteger(id) && id > 0))
      .withMessage("All question IDs in the array must be positive integers"),
  ],
  handleValidationErrors,
  // Controller sẽ xử lý validation param :examId
  examQuestionController.addQuestionsToExam
);

// 9. DELETE Xóa nhiều câu hỏi khỏi một bài thi (Yêu cầu Admin)
router.delete(
  "/bulk/remove-from-exam/:examId", // DELETE /exam-questions/bulk/remove-from-exam/:examId
  authMiddleware,
  adminMiddleware,
  [
    // Validate body chứa mảng questionIds
    body("questionIds")
      .isArray({ min: 1 })
      .withMessage("questionIds must be a non-empty array")
      .custom((ids) => ids.every((id) => Number.isInteger(id) && id > 0))
      .withMessage("All question IDs in the array must be positive integers"),
  ],
  handleValidationErrors,
  // Controller sẽ xử lý validation param :examId
  examQuestionController.removeQuestionsFromExam
);

// 10. PUT Cập nhật thứ tự câu hỏi cho một bài thi (Yêu cầu Admin)
router.put(
  "/order/for-exam/:examId", // PUT /exam-questions/order/for-exam/:examId
  authMiddleware,
  adminMiddleware,
  [
    // Validate body chứa mảng orderedQuestionIds
    body("orderedQuestionIds")
      .isArray()
      .withMessage("orderedQuestionIds must be an array") // Cho phép mảng rỗng
      .custom((ids) => ids.every((id) => Number.isInteger(id) && id > 0))
      .withMessage(
        "All question IDs in the order array must be positive integers"
      ),
  ],
  handleValidationErrors,
  // Controller sẽ xử lý validation param :examId
  examQuestionController.updateQuestionOrderForExam
);

module.exports = router;
