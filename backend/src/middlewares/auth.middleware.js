// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Chứa jwtSecret

const authMiddleware = (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers.authorization); // Log headers
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token found'); // Log khi không tìm thấy token
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    console.log('Token:', token); // Log token
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Decoded token:', decoded); // Log token đã decode
    
    // Đảm bảo decoded token có userId
    if (!decoded.userId) {
      console.error('Token không chứa userId');
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error); // Log lỗi chi tiết
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = authMiddleware;