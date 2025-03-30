const express = require('express');
const adminExamCategoryController = require('../../controllers/admin/admin_exam_category.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/', adminExamCategoryController.getAllCategories);
router.get('/:id', adminExamCategoryController.getCategoryById);
router.post('/', adminExamCategoryController.createCategory);
router.put('/:id', adminExamCategoryController.updateCategory);
router.delete('/:id', adminExamCategoryController.deleteCategory);

module.exports = router;