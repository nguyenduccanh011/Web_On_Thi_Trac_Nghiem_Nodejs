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
        const questionId = req.params.id;
        const question = await questionService.getQuestionById(questionId);
        res.json(question);
    } catch (error) {
        res.status(404).json({ message: error.message });
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
        const questionId = req.params.id;
        const questionData = req.body;
        const updatedQuestion = await questionService.updateQuestion(questionId, questionData);
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        await questionService.deleteQuestion(questionId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
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