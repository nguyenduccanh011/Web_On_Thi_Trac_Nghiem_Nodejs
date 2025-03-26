// src/controllers/exam_attempt.controller.js

const examAttemptService = require("../services/exam_attempt.service");

exports.getAttempByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await examAttemptService.getAttemptsByUser(userId);
    res.json(attempts);
  } catch (error) {
    res.status(404).json({ message: error.message }); // 404 nếu không tìm thấy
  }
};

exports.getAttemptDetails = async (req, res) => {
  try {
    const attemptId = req.params.id;
    //  const userId = req.user.userId; // Kiểm tra attempt có thuộc về user không (tùy chọn)
    const attemptDetails = await examAttemptService.getAttemptDetails(
      attemptId
    );
    res.json(attemptDetails);
  } catch (error) {
    res.status(404).json({ message: error.message }); // 404 nếu không tìm thấy
  }
};
