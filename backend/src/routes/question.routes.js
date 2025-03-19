const express = require('express');
const questionController = require('../controllers/question.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const router = express.Router();

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.get('/search', questionController.searchQuestions); // Route tìm kiếm

//Các route cần xác thực và phân quyền admin
//router.post('/', authMiddleware.verifyToken, adminMiddleware.isAdmin, questionController.createQuestion);
router.post('/', questionController.createQuestion);
router.put('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, questionController.updateQuestion);
//router.delete('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, questionController.deleteQuestion);
router.delete('/:id', questionController.deleteQuestion);


module.exports = router;