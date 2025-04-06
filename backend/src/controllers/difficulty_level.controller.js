const difficultyLevelService = require("../services/difficulty_level.service");
const DifficultyLevel = require("../models/difficulty_level.model");

exports.getAllDifficultyLevels = async (req, res) => {
  try {
    const difficultyLevels =
      await difficultyLevelService.getAllDifficultyLevels();
    res.json(difficultyLevels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDifficultyLevelById = async (req, res) => {
  try {
    const difficultyLevel = await difficultyLevelService.getDifficultyLevelById(
      req.params.id
    );
    if (!difficultyLevel) {
      return res.status(404).json({ message: "Difficulty Level not found" });
    }
    res.json(difficultyLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new difficultyLevel with answers
exports.createDifficultyLevel = async (req, res) => {
  try {
    const { difficult_level_text } = req.body;
    console.log("--------Difficulty Level created:", difficult_level_text);
    const difficultyLevel = await difficultyLevelService.createDifficultyLevel({
      difficult_level_text,
    });
    res.status(201).json(difficultyLevel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDifficultyLevel = async (req, res) => {
  try {
    const difficultyLevel = await difficultyLevelService.updateDifficultyLevel(
      req.params.id,
      req.body
    );
    if (!difficultyLevel) {
      return res.status(404).json({ message: "Difficulty Level not found" }); // Hoặc xử lý tùy theo logic của bạn
    }
    res.json(difficultyLevel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDifficultyLevel = async (req, res) => {
  try {
    const result = await difficultyLevelService.deleteDifficultyLevel(
      req.params.id
    );
    if (result.message === "Difficulty Level not found") {
      return res.status(404).json({ message: result.message });
    }
    res.status(204).send(); // 204 No Content (thành công, không có nội dung trả về)
  } catch (error) {
    if (
      error.message ===
      "Cannot delete Difficulty Level because it is associated with one or more questions"
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.searchDifficultyLevels = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const difficultyLevels =
      await difficultyLevelService.searchDifficultyLevels(searchTerm);
    res.json(difficultyLevels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a difficultyLevel with its answers
exports.getDifficultyLevel = async (req, res) => {
  try {
    const difficultyLevel = await DifficultyLevel.findByPk(req.params.id, {
      include: [{ model: Answer, as: "answers" }],
    });

    if (!difficultyLevel) {
      return res.status(404).json({ error: "DifficultyLevel not found" });
    }

    res.status(200).json(difficultyLevel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
