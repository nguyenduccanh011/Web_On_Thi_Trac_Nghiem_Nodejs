// src/routes/admin/admin_exam.routes.js
const express = require('express');
const adminExamController = require('../../controllers/admin/admin_exam.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');

const router = express.Router();

// Tất cả các route trong này đều cần xác thực và quyền admin
router.use(authMiddleware, adminMiddleware);

router.get('/', adminExamController.getAllExams);
router.get('/:id', adminExamController.getExamById);
router.post('/', adminExamController.createExam);
router.put('/:id', adminExamController.updateExam);
router.delete('/:id', adminExamController.deleteExam);

module.exports = router;