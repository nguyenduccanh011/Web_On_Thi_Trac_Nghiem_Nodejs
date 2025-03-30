const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/user_profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Log middleware để theo dõi request
router.use((req, res, next) => {
  console.log('Profile route accessed:', req.method, req.path);
  next();
});

// Áp dụng middleware xác thực cho tất cả các routes
router.use(authMiddleware);

// Lấy thông tin profile
router.get('/', (req, res, next) => {
  console.log('Getting profile...');
  userProfileController.getProfile(req, res, next);
});

// Cập nhật thông tin profile
router.put('/', (req, res, next) => {
  console.log('Updating profile...');
  userProfileController.updateProfile(req, res, next);
});

module.exports = router; 