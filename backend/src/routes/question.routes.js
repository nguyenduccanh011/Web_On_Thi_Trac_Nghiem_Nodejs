const express = require('express');
const questionController = require('../controllers/question.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { body } = require('express-validator');

const router = express.Router();

// Các route công khai
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.get('/search', questionController.searchQuestions);

// Các route cần xác thực và phân quyền admin
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('question_text').notEmpty().withMessage('Question text is required'),
    body('correct_answer').notEmpty().withMessage('Correct answer is required'),
    body('option_a').notEmpty().withMessage('Option A is required'),
    body('option_b').notEmpty().withMessage('Option B is required'),
    body('category_id').isInt().withMessage('Category ID must be an integer'),
  ],
  questionController.createQuestion
);

router.put('/:id', authMiddleware, adminMiddleware, questionController.updateQuestion);
router.delete('/:id', authMiddleware, adminMiddleware, questionController.deleteQuestion);

module.exports = router;