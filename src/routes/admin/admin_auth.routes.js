// src/routes/admin/admin_auth.routes.js
const express = require('express');
const adminAuthController = require('../../controllers/admin/admin_auth.controller');
const { body } = require('express-validator');

const router = express.Router();

// Đăng nhập cho admin (nếu có hệ thống admin riêng)
router.post(
  '/login',
    [
      body('username').notEmpty().withMessage('Username is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
  adminAuthController.adminLogin
);

module.exports = router;