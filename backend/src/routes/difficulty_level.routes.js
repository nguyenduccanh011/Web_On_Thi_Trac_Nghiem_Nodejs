const express = require("express");
const difficultyLevelController = require("../controllers/difficulty_level.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const { body } = require("express-validator");

const router = express.Router();

// Các route công khai
router.get("/", difficultyLevelController.getAllDifficultyLevels);
router.get("/:id", difficultyLevelController.getDifficultyLevelById);
router.get("/search", difficultyLevelController.searchDifficultyLevels);

// Các route cần xác thực và phân quyền admin
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [
    body("difficult_level_text")
      .notEmpty()
      .withMessage("Difficulty Level text is required"),
  ],
  difficultyLevelController.createDifficultyLevel
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  difficultyLevelController.updateDifficultyLevel
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  difficultyLevelController.deleteDifficultyLevel
);

module.exports = router;
