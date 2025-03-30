// src/middlewares/admin.middleware.js
const adminMiddleware = (req, res, next) => {
  // Giả sử thông tin role được lưu trong req.user (sau khi qua auth.middleware)
  if (req.user && req.user.role === 'admin') {
    next(); // Cho phép truy cập
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Bạn không có quyền truy cập chức năng này' 
    });
  }
};

module.exports = adminMiddleware;