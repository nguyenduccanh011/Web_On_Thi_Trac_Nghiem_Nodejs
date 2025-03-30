// src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator'); // Để validate dữ liệu đầu vào

const router = express.Router();

// Đăng ký (Register)
router.post(
  '/register',
  [
    // Validate dữ liệu
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  ],
  authController.register
);

// Đăng nhập (Login)
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Quên mật khẩu
router.post(
  '/forgot-password',
  [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  ],
  authController.forgotPassword
);
// Đặt lại mật khẩu
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  ],
  authController.resetPassword
);

module.exports = router;