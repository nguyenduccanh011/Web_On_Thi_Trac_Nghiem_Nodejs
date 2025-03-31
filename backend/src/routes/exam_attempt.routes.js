// src/routes/exam_attempt.routes.js
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const examAttemptController = require("../controllers/exam_attempt.controller");
const router = express.Router();

//Lấy danh sách bài thi của một user
router.get("/me", authMiddleware, examAttemptController.getAttempByUser);

//Lấy chi tiết lần làm bài (cần xác thực)
router.get("/:id", authMiddleware, examAttemptController.getAttemptDetails);

//Lưu kết quả bài thi (cần xác thực)
router.post("/save", authMiddleware, examAttemptController.saveExamAttempt);

module.exports = router;
