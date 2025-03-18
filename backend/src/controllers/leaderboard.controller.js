// src/controllers/leaderboard.controller.js
const leaderboardService = require('../services/leaderboard.service');

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await leaderboardService.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Không cần controller cho updateLeaderboard vì nó được gọi từ exam_attempt.service.js