const examAttemptService = require("../services/exam_attempt.service");
const examService = require("../services/exam.service");
const userAnswerService = require("../services/user_answer.service");

exports.saveExamAttempt = async (req, res) => {
  try {
    const result = req.body;
    const userId = req.user.userId; 

    const exam = await examService.getExamById(result.exam_id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Lưu kết quả bài thi
    const attempt = await examAttemptService.saveExamAttempt(userId, result);
    if (!attempt) {
      return res.status(400).json({ message: "Failed to save attempt" });
    }

    // Lưu câu trả lời của người dùng
    const answers = await userAnswerService.saveUserAnswer(
      attempt.attempt_id,
      result.answers
    );
    if (!answers) {
      return res.status(400).json({ message: "Failed to save answers" });
    }

    await res.status(201).json({ message: "OK" }); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

exports.getAttempByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const attempts = await examAttemptService.getAttemptsByUser(userId);
    res.json(attempts);
  } catch (error) {
    res.status(404).json({ message: error.message }); 
  }
};

exports.getAttemptDetails = async (req, res) => {
  try {
    const attemptId = req.params.id;

    const attempt = await examAttemptService.getAttemptById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    if (attempt.user_id !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const attemptDetails = await examAttemptService.getAttemptDetails(
      attemptId
    );

    res.json(attemptDetails);
  } catch (error) {
    res.status(404).json({ message: error.message }); 
  }
};
