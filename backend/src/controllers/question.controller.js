// src/controllers/question.controller.js
const questionService = require('../services/question.service');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await questionService.getAllQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await questionService.getQuestionById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const questionData = req.body;
        const newQuestion = await questionService.createQuestion(questionData);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateQuestion = async (req, res) => {
    try {
        const question = await questionService.updateQuestion(req.params.id, req.body);
         if (!question) {
                return res.status(404).json({ message: 'Question not found' }); // Hoặc xử lý tùy theo logic của bạn
         }
        res.json(question);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const result = await questionService.deleteQuestion(req.params.id);
          if (result.message === 'Question not found') {
                return res.status(404).json({ message: result.message });
            }
        res.status(204).send();  // 204 No Content (thành công, không có nội dung trả về)
    } catch (error) {
         if (error.message === 'Cannot delete question because it is associated with one or more exams') {
              res.status(400).json({ message: error.message });
         }
         else{
            res.status(500).json({ message: error.message });
         }
    }
};

exports.searchQuestions = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const questions = await questionService.searchQuestions(searchTerm);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};