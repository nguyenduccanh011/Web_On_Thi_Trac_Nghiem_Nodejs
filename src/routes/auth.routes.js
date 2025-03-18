// src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator');

const router = express.Router();

router.post('/register', [
  body('username').notEmpty().withMessage('Username is required').isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('full_name').optional().isLength({ max: 100 }).withMessage('Full name cannot exceed 100 characters'),
], authController.register);

router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], authController.login);

module.exports = router;