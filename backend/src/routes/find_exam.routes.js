// src/routes/exam.routes.js
const express = require("express");
const findExamController = require("../controllers/find_exam.controller"); // Import controller tìm kiếm
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
router.get("/search", findExamController.searchExams) ; // Lấy danh sách exam cơ bản
module.exports = router;