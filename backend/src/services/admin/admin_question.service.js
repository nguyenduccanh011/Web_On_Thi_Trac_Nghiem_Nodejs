//src/services/admin/admin_question.service.js
const Question = require('../../models/question.model');
exports.createQuestionByAdmin = async (questionData) => {
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