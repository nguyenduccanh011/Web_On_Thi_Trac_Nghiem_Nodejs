// src/controllers/question.controller.js
const questionService = require('../services/question.service');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model'); // Import Answer model

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

// Create a new question with answers
exports.createQuestion = async (req, res) => {
  try {
    const { question_text, correct_answer, category_id, difficulty, explanation, answers } = req.body;

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

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Get a question with its answers
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [{ model: Answer, as: 'answers' }],
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};