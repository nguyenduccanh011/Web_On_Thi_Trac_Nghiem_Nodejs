// src/routes/user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware')

const router = express.Router();

// Lấy thông tin user hiện tại (dựa vào token)
router.get('/me', authMiddleware.verifyToken, async (req, res) => {
    try {
        // req.user chứa thông tin user đã được giải mã từ token
        const userId = req.user.userId;
        const user = await require('../services/user.service').getUserById(userId); // Gọi service để lấy thông tin
        if(!user) {
          return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy lịch sử thi của user hiện tại
router.get('/my-history', authMiddleware.verifyToken, async (req,res) => {
    try {
        const userId = req.user.userId;
        const examHistory = await require('../services/user.service').getUserExamHistory(userId);
        res.status(200).json(examHistory);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// Lấy thông tin user theo ID (chỉ admin mới có quyền)
router.get('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, userController.getUserById);

// Cập nhật thông tin user (chỉ user hiện tại hoặc admin mới có quyền)
router.put('/:id', authMiddleware.verifyToken,  async(req, res) => {
    // Kiểm tra xem user hiện tại có phải là user cần update hoặc là admin không
    if(req.user.userId == req.params.id || req.user.role === 'admin') {
       return userController.updateUser(req,res)
    } else {
        return res.status(403).json({message: "Forbidden"})
    }
});

// Xóa user (chỉ admin)
router.delete('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, userController.deleteUser);

// Lấy danh sách tất cả user (chỉ admin)
router.get('/', authMiddleware.verifyToken, adminMiddleware.isAdmin, userController.getAllUsers)

module.exports = router;