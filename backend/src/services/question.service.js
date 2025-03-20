// src/services/question.service.js
const Question = require('../models/question.model');
const ExamCategory = require('../models/exam_category.model');
const Answer = require('../models/answer.model'); // Import Answer model
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

// Create a new question with answers
exports.createQuestion = async (data) => {
  const { question_text, correct_answer, category_id, difficulty, explanation, answers } = data;

  const question = await Question.create({
    question_text,
    correct_answer,
    category_id,
    difficulty,
    explanation,
  });

  if (answers && answers.length > 0) {
    for (const answer of answers) {
      await Answer.create({
        answer_text: answer.answer_text,
        question_id: question.question_id,
        is_correct: answer.is_correct,
      });
    }
  }

  return question;
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
        return { message: 'Question not found' }; // Return object
      }

      // Kiểm tra xem câu hỏi có đang được sử dụng trong đề thi nào không
      const examQuestions = await question.getExams(); // Assuming you have defined the many-to-many relationship

      if (examQuestions.length > 0) {
        throw new Error('Cannot delete question because it is associated with one or more exams');
      }

      // Xóa câu hỏi
      await question.destroy();
      return { message: 'Question deleted successfully' }; // Return a success message
    } catch (error) {
      throw error; // Re-throw the error to be handled by the controller
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

// Get a question with its answers
exports.getQuestion = async (id) => {
  const question = await Question.findByPk(id, {
    include: [{ model: Answer, as: 'answers' }],
  });

  if (!question) {
    throw new Error('Question not found');
  }

  return question;
};