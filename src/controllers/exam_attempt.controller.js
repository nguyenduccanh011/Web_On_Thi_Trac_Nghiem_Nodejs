// src/controllers/exam_attempt.controller.js

const examAttemptService = require('../services/exam_attempt.service');

exports.startExamAttempt = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy userId từ thông tin đã xác thực
        const { examId } = req.body;

        const attempt = await examAttemptService.startExamAttempt(userId, examId);
        res.status(201).json(attempt); // 201 Created
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { attemptId, questionId, selectedAnswer } = req.body;
        // const userId = req.user.userId; // Có thể kiểm tra thêm quyền của user

        const userAnswer = await examAttemptService.submitAnswer(attemptId, questionId, selectedAnswer);
        res.json(userAnswer); // Hoặc chỉ trả về message
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.endExamAttempt = async (req, res) => {
    try {
        const { attemptId } = req.body;
        //  const userId = req.user.userId;  // Kiểm tra quyền

        const attempt = await examAttemptService.endExamAttempt(attemptId);
        res.json(attempt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttemptDetails = async (req, res) => {
    try {
        const attemptId = req.params.id;
      //  const userId = req.user.userId; // Kiểm tra attempt có thuộc về user không (tùy chọn)
        const attemptDetails = await examAttemptService.getAttemptDetails(attemptId);
        res.json(attemptDetails);
    } catch (error) {
        res.status(404).json({message: error.message}); // 404 nếu không tìm thấy
    }
}