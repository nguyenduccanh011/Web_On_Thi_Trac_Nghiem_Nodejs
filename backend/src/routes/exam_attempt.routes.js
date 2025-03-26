// src/routes/exam_attempt.routes.js
const express = require("express");
const examAttemptController = require("../controllers/exam_attempt.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

//Lấy danh sách bài thi của một user
router.get("/me", authMiddleware.verifyToken, examAttemptController.getAttempByUser);

// Lấy chi tiết lần làm bài (cần xác thực)
router.get("/:id", authMiddleware.verifyToken, examAttemptController.getAttemptDetails);

module.exports = router;
