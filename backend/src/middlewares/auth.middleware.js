const jwt = require('jsonwebtoken');
const config = require('../config/config'); 

const authMiddleware = (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers.authorization); 
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token found'); 
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    console.log('Token:', token); 
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Decoded token:', decoded);
    
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
    console.error('Auth error:', error); 
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = authMiddleware;