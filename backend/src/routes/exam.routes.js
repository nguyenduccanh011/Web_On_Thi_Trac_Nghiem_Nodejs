// src/routes/exam.routes.js
const express = require("express");
const examController = require("../controllers/exam.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/", examController.getAllExams);
router.get("/:id", examController.getExamById);

// Các route cần xác thực và phân quyền admin
router.post('/', authMiddleware, adminMiddleware, examController.createExam);
router.put('/:id', authMiddleware, adminMiddleware, examController.updateExam);
router.delete('/:id', authMiddleware, adminMiddleware, examController.deleteExam);
// Route lấy câu hỏi cho bài thi, cần xác thực user
router.get('/questions', authMiddleware, examController.getQuestionsForExam);

module.exports = router;
