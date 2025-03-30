// src/routes/admin/admin_question.routes.js
const express = require('express');
const adminQuestionController = require('../../controllers/admin/admin_question.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');
const router = express.Router();

// Tất cả các route trong này đều cần xác thực và quyền admin
router.use(authMiddleware, adminMiddleware);

router.get('/', adminQuestionController.getAllQuestions);
router.get('/:id', adminQuestionController.getQuestionById);
router.post('/', adminQuestionController.createQuestion);
router.put('/:id', adminQuestionController.updateQuestion);
router.delete('/:id', adminQuestionController.deleteQuestion);

module.exports = router;