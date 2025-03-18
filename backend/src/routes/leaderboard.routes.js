// src/routes/leaderboard.routes.js
const express = require('express');
const leaderboardController = require('../controllers/leaderboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Lấy bảng xếp hạng (cần xác thực)
router.get('/', authMiddleware.verifyToken, leaderboardController.getLeaderboard);

module.exports = router;