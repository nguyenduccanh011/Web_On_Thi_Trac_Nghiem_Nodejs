const express = require("express");
const router = express.Router();
const userProfileRoutes = require("./user_profile.routes");
const authRoutes = require("./auth.routes");
const examRoutes = require("./exam.routes");
const examCategoryRoutes = require("./exam_category.routes");
const leaderboardRoutes = require("./leaderboard.routes");
const difficultyLevelRoutes = require("./difficulty_level.routes");
const examAttemptRoutes = require("./exam_attempt.routes");

// Định nghĩa các routes
router.use("/auth", authRoutes);
router.use("/profile", userProfileRoutes);
router.use("/exams", examRoutes);
router.use("/categories", examCategoryRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/difficulty-level", difficultyLevelRoutes);
router.use("/attempts", examAttemptRoutes);

module.exports = router;
