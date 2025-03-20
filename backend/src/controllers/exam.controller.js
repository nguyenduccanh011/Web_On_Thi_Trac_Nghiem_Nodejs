// src/controllers/exam.controller.js
const examService = require("../services/exam.service");
const shuffleArray = require("lodash");

exports.getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await examService.getExamById(examId);
    res.json(exam);
  } catch (error) {
    res.status(404).json({ message: error.message }); // 404 Not Found nếu không tìm thấy
  }
};

exports.createExam = async (req, res) => {
  try {
    const examData = req.body;
    const newExam = await examService.createExam(examData);
    res.status(201).json(newExam); // 201 Created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const examData = req.body;
    const updatedExam = await examService.updateExam(examId, examData);
    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const examId = req.params.id;
    await examService.deleteExam(examId);
    res.status(204).json({ message: "Exam deleted successfully" }); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy câu hỏi cho bài thi (dựa vào category, difficulty, limit)
exports.getQuestionsForExam = async (req, res) => {
  try {
    const { examId } = req.query; // Lấy các tham số từ query string
    const questions = await examService.getQuestionsForExam(examId); // Gọi service để lấy câu hỏi
    const shuffledQuestions = shuffleArray.shuffle(questions); // Trộn câu hỏi
    res.json(shuffledQuestions); // Trả về danh sách câu hỏi đã trộn
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
