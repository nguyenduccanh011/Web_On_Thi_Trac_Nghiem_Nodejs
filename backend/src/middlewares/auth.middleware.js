// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Chứa jwtSecret

exports.verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization (dạng "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' }); // 401 Unauthorized
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      // Token không hợp lệ (hết hạn, sai secret, ...)
      return res.status(401).json({ message: 'Invalid token' }); // 401 Unauthorized
    }

    // Token hợp lệ, lưu thông tin user vào req.user để sử dụng ở các middleware/controller sau
    req.user = decoded; // decoded chứa thông tin user (ví dụ: userId, role, ...)
    next(); // Tiếp tục đến middleware/controller tiếp theo
  });
};