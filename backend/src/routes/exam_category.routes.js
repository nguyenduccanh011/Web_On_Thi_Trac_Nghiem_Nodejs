const express = require('express');
const examCategoryController = require('../controllers/exam_category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

router.get('/', examCategoryController.getAllCategories);
router.get('/:id', examCategoryController.getCategoryById);

//Các route cần xác thực và phân quyền
router.post('/', authMiddleware.verifyToken, adminMiddleware.isAdmin, examCategoryController.createCategory);
router.put('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, examCategoryController.updateCategory);
router.delete('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, examCategoryController.deleteCategory);


module.exports = router;