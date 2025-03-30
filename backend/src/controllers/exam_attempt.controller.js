// src/controllers/exam_attempt.controller.js
const examAttemptService = require("../services/exam_attempt.service");

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
