// src/routes/admin/admin_user.routes.js
const express = require('express');
const adminUserController = require('../../controllers/admin/admin_user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');

const router = express.Router();
//Tất cả route cần xác thực và phân quyền
router.use(authMiddleware.verifyToken, adminMiddleware.isAdmin);

router.get('/', adminUserController.getAllUsers);
router.get('/:id', adminUserController.getUserById);
router.put('/:id', adminUserController.updateUser);
router.delete('/:id', adminUserController.deleteUser);
router.get('/role/:role', adminUserController.getUsersByRole); // Lấy user theo role
router.put('/change-role', adminUserController.changeUserRole); // Đổi role của user

module.exports = router;