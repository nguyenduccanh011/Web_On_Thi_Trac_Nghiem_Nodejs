// src/routes/exam_attempt.routes.js
const express = require('express');
const examAttemptController = require('../controllers/exam_attempt.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Bắt đầu làm bài (cần xác thực)
router.post('/start', authMiddleware, examAttemptController.startExamAttempt);

// Nộp câu trả lời (cần xác thực)
router.post('/submit', authMiddleware, examAttemptController.submitAnswer);

// Kết thúc bài làm (cần xác thực)
router.post('/end', authMiddleware, examAttemptController.endExamAttempt);

// Lấy chi tiết lần làm bài (cần xác thực)
router.get('/:id', authMiddleware, examAttemptController.getAttemptDetails);

module.exports = router;