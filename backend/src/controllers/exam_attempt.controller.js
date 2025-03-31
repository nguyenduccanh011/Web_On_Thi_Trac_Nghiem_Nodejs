// src/controllers/exam_attempt.controller.js
const examAttemptService = require("../services/exam_attempt.service");
const userAnswerService = require("../services/user_answer.service");

exports.saveExamAttempt = async (req, res) => {
  try {
    const result = req.body;
    const userId = req.user.userId; // Lấy userId từ req.user (đã xác thực)

    // Kiểm tra xem bài thi có tồn tại không
    const exam = await examAttemptService.getAttemptById(result.exam_id);
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

    await res.status(201).json({ message: "OK" }); // 201 Created nếu lưu thành công
  } catch (error) {
    res.status(500).json({ message: error.message }); // 500 nếu có lỗi xảy ra
  }
};

exports.getAttempByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const attempts = await examAttemptService.getAttemptsByUser(userId);
    res.json(attempts);
  } catch (error) {
    res.status(404).json({ message: error.message }); // 404 nếu không tìm thấy
  }
};

exports.getAttemptDetails = async (req, res) => {
  try {
    const attemptId = req.params.id;

    const attempt = await examAttemptService.getAttemptById(attemptId);
    if (!attempt) {
      // Nếu không tìm thấy attempt, trả về lỗi 404 (Not Found)
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Kiểm tra xem attempt có thuộc về user không (tùy chọn)
    if (attempt.user_id !== req.user.userId) {
      // Nếu attempt không thuộc về user, trả về lỗi 403 (Forbidden)
      return res.status(403).json({ message: "Forbidden" });
    }

    const attemptDetails = await examAttemptService.getAttemptDetails(
      attemptId
    );

    res.json(attemptDetails);
  } catch (error) {
    res.status(404).json({ message: error.message }); // 404 nếu không tìm thấy
  }
};
