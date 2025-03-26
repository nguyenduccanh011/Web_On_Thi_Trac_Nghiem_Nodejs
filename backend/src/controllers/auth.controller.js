const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array()); // Log validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password, fullname } = req.body;
    console.log('Registering user:', { username, email, fullname }); // Log request data
    const newUser = await authService.registerUser(username, email, password, fullname);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error.message === 'Username already exists' || error.message === 'Email already exists') {
      res.status(409).json({ message: error.message }); // 409 Conflict
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const { user, token } = await authService.loginUser(username, password);

    // Có thể trả về thêm thông tin user (tùy chọn)
    res.status(200).json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });

  } catch (error) {
    if (error.message === 'Invalid credentials') {
      res.status(401).json({ message: error.message }); // 401 Unauthorized
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Xử lý quên mật khẩu
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'Password reset instructions have been sent to your email' });
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: 'No account found with this email address' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Xử lý đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      res.status(400).json({ message: 'Invalid or expired reset token' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};