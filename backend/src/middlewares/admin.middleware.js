// src/middlewares/admin.middleware.js

exports.isAdmin = (req, res, next) => {
    // Giả sử thông tin role được lưu trong req.user (sau khi qua auth.middleware.verifyToken)
    if (req.user && req.user.role === 'admin') {
      next(); // Cho phép truy cập
    } else {
      return res.status(403).json({ message: 'Forbidden' }); // 403 Forbidden (không có quyền)
    }
  };