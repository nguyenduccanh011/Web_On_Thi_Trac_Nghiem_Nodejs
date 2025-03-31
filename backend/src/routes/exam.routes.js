// src/routes/exam.routes.js
const express = require("express");
const examController = require("../controllers/exam.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const { body, param, validationResult } = require("express-validator"); // Import thêm

const router = express.Router();

// Middleware xử lý lỗi validation (nếu dùng chung)
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

// --- Public Routes ---
router.get("/", examController.getAllExams); // Lấy danh sách exam cơ bản
router.get("/:id", examController.getExamById); // Lấy chi tiết exam cơ bản

// --- Authenticated Routes ---
router.get(
  "/:id/take-exam", // Route để bắt đầu làm bài
  authMiddleware,
  examController.getQuestionsForExamTake // Sử dụng controller mới
);

// --- Admin Routes ---

// Tạo exam (chỉ thông tin cơ bản)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    body("exam_name").notEmpty().withMessage("Exam name is required"),
    body("category_id")
      .isInt({ gt: 0 })
      .withMessage("Category ID must be a positive integer"),
    // description là tùy chọn
  ],
  handleValidationErrors,
  examController.createExam
);

// Cập nhật exam (chỉ thông tin cơ bản)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    // Validate param và body
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Exam ID must be a positive integer"),
    body("exam_name").notEmpty().withMessage("Exam name is required"),
    body("category_id")
      .isInt({ gt: 0 })
      .withMessage("Category ID must be a positive integer"),
  ],
  handleValidationErrors,
  examController.updateExam
);

// *** ROUTE MỚI: Thiết lập/thay thế câu hỏi cho exam ***
router.put(
  "/:examId/set-questions", // Dùng PUT vì đây là hành động thay thế toàn bộ
  authMiddleware,
  adminMiddleware,
  [
    param("examId")
      .isInt({ gt: 0 })
      .withMessage("Exam ID must be a positive integer"),
    body("questionIds")
      .isArray()
      .withMessage("questionIds must be an array (can be empty)")
      .custom((ids) => ids.every((id) => Number.isInteger(id) && id > 0))
      .withMessage("All question IDs in the array must be positive integers"),
  ],
  handleValidationErrors,
  examController.setExamQuestions
);

// *** ROUTE MỚI: Thiết lập/thay thế liên kết độ khó cho exam ***
router.put(
  "/:examId/set-difficulty-links", // Dùng PUT vì đây là hành động thay thế toàn bộ
  authMiddleware,
  adminMiddleware,
  [
    param("examId")
      .isInt({ gt: 0 })
      .withMessage("Exam ID must be a positive integer"),
    body("links")
      .isArray()
      .withMessage("links must be an array (can be empty)")
      .custom((links) =>
        links.every(
          (link) =>
            link &&
            typeof link === "object" &&
            Number.isInteger(link.difficult_level_id) &&
            link.difficult_level_id > 0 &&
            Number.isInteger(link.question_count) &&
            link.question_count >= 0
        )
      )
      .withMessage(
        "Each link object must have a positive integer difficult_level_id and a non-negative integer question_count."
      ),
  ],
  handleValidationErrors,
  examController.setExamDifficultyLinks
);

// Xóa exam
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [
    param("id")
      .isInt({ gt: 0 })
      .withMessage("Exam ID must be a positive integer"),
  ],
  handleValidationErrors,
  examController.deleteExam
);

// Bỏ route GET /questions cũ vì đã có route chi tiết hơn trong examQuestionRouter
// router.get("/questions", authMiddleware, examController.getQuestionsForExam);

module.exports = router;
