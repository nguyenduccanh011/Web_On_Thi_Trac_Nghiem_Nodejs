// src/routes/exam_question.router.js
const express = require("express");
const examQuestionController = require("../controllers/exam_question.controller"); 
const authMiddleware = require("../middlewares/auth.middleware"); 
const adminMiddleware = require("../middlewares/admin.middleware");
const { body, validationResult } = require("express-validator"); 

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const firstError = errors.array()[0];
  return res
    .status(400)
    .json({ message: `${firstError.param}: ${firstError.msg}` }); 
};


router.get(
  "/", 
  authMiddleware,
  adminMiddleware,
  examQuestionController.getAllExamQuestions
);

router.post(
  "/", 
  adminMiddleware,
  [
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
    body("question_order") 
      .optional({ nullable: true }) 
      .isInt({ min: 0 })
      .withMessage("Question order must be a non-negative integer"),
  ],
  handleValidationErrors, 
  examQuestionController.createExamQuestion
);

router.get(
  "/:id", 
  authMiddleware,
  adminMiddleware,
  examQuestionController.getExamQuestionById
);

router.put(
  "/:id", 
  authMiddleware,
  adminMiddleware,
  [
    body("question_order")
      .optional({ nullable: true })
      .isInt({ min: 0 })
      .withMessage("Question order must be a non-negative integer"),
  ],
  handleValidationErrors, 
  examQuestionController.updateExamQuestion
);

router.delete(
  "/:id", 
  authMiddleware,
  adminMiddleware,
  examQuestionController.deleteExamQuestion
);


router.get(
  "/for-exam/:examId", 
  authMiddleware, 
  examQuestionController.getQuestionsForExam
);

router.get(
  "/for-question/:questionId", 
  authMiddleware,
  adminMiddleware,
  examQuestionController.getExamsForQuestion
);

router.post(
  "/bulk/add-to-exam/:examId",
  authMiddleware,
  adminMiddleware,
  [
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
