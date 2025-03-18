// src/services/question.service.js
const Question = require('../models/question.model');
const ExamCategory = require('../models/exam_category.model');
const { Sequelize } = require('sequelize');
exports.getAllQuestions = async () => {
  try {
    const questions = await Question.findAll({
      include: [{ model: ExamCategory, as: 'category' }],
    });
    return questions;
  } catch (error) {
    throw error;
  }
};

exports.getQuestionById = async (questionId) => {
  try {
    const question = await Question.findByPk(questionId, {
      include: [{ model: ExamCategory, as: 'category' }],
    });
    if (!question) {
      throw new Error('Question not found');
    }
    return question;
  } catch (error) {
    throw error;
  }
};

exports.createQuestion = async (questionData) => {
  try {
    const newQuestion = await Question.create(questionData);
      // Lấy thông tin đầy đủ của câu hỏi sau khi tạo (tùy chọn)
    const createdQuestion = await Question.findByPk(newQuestion.question_id, {
        include: [{ model: ExamCategory, as: 'category' }],
    });
    return createdQuestion;
  } catch (error) {
    throw error;
  }
};

exports.updateQuestion = async (questionId, questionData) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    await question.update(questionData);
     // Lấy thông tin đầy đủ của câu hỏi sau khi update (tùy chọn)
    const updatedQuestion = await Question.findByPk(questionId, {
        include: [{ model: ExamCategory, as: 'category' }],
    });
    return updatedQuestion;
  } catch (error) {
    throw error;
  }
};

exports.deleteQuestion = async (questionId) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    await question.destroy();
    return { message: 'Question deleted successfully' };
  } catch (error) {
    throw error;
  }
};
// Hàm tìm kiếm câu hỏi
exports.searchQuestions = async (searchTerm) => {
  try {
    const questions = await Question.findAll({
      where: {
        [Sequelize.Op.or]: [
          { question_text: { [Sequelize.Op.like]: `%${searchTerm}%` } },
          { explanation: { [Sequelize.Op.like]: `%${searchTerm}%` } },
          // Thêm các trường khác bạn muốn tìm kiếm (ví dụ: option_a, option_b, ...)
        ],
      },
        include: [{model: ExamCategory, as: 'category'}]
    });
    return questions;
  } catch (error) {
    throw error;
  }
};