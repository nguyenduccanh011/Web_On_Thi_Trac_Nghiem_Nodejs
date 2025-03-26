// src/routes/user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware')
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');


const router = express.Router();

// Middleware xác thực cho tất cả các routes
router.use(authMiddleware.verifyToken);

// Lấy thông tin user hiện tại (dựa vào token)
router.get('/me', async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await userService.getUserById(userId);
        if(!user) {
          return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy lịch sử thi của user hiện tại
router.get('/my-history', async (req,res) => {

    try {
        const userId = req.user.id;
        const examHistory = await userService.getUserExamHistory(userId);
        res.status(200).json(examHistory);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Lấy thông tin user theo ID (chỉ admin mới có quyền)
router.get('/:id', userController.getUserById);

// Cập nhật thông tin user
router.put('/:id', [
  body('full_name').optional().trim().notEmpty().withMessage('Họ và tên không được để trống'),
  body('email').optional().isEmail().withMessage('Email không hợp lệ'),
  body('username').optional().trim().notEmpty().withMessage('Username không được để trống'),
  body('password').optional().isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
], userController.updateUser);


// Xóa user (chỉ admin)
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

// Lấy danh sách tất cả user (chỉ admin)
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
    cb(null, true);
  }
});

// Cập nhật ảnh đại diện
router.post('/profile-picture', upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không tìm thấy file ảnh' });
    }

    const userId = req.user.userId;
    const profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    
    const updatedUser = await require('../services/user.service').updateProfilePicture(userId, profilePicture);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;