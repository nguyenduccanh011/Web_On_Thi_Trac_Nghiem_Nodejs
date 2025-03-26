const express = require('express');
const examCategoryController = require('../controllers/exam_category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

// Các route công khai
router.get('/', examCategoryController.getAllCategories);
router.get('/:id', examCategoryController.getCategoryById);

// Các route cần xác thực và phân quyền admin
router.post('/', authMiddleware, adminMiddleware, examCategoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, examCategoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, examCategoryController.deleteCategory);

module.exports = router;