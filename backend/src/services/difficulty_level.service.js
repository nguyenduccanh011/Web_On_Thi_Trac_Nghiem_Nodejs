const DifficultyLevel = require("../models/difficulty_level.model");
const Question = require("../models/question.model");
const { Sequelize } = require("sequelize");
exports.getAllDifficultyLevels = async () => {
  try {
    const difficultyLevels = await DifficultyLevel.findAll();
    return difficultyLevels;
  } catch (error) {
    throw error;
  }
};

exports.getDifficultyLevelById = async (difficultyLevelId) => {
  try {
    const difficultyLevel = await DifficultyLevel.findByPk(difficultyLevelId);
    if (!difficultyLevel) {
      throw new Error("Difficulty Level not found");
    }
    return difficultyLevel;
  } catch (error) {
    throw error;
  }
};

exports.createDifficultyLevel = async (data) => {
  const { difficult_level_text } = data;

  const difficultyLevel = await DifficultyLevel.create({
    difficult_level_text,
  });

  return difficultyLevel;
};

exports.updateDifficultyLevel = async (
  difficultyLevelId,
  difficultyLevelData
) => {
  try {
    const difficultyLevel = await DifficultyLevel.findByPk(difficultyLevelId);
    if (!difficultyLevel) {
      throw new Error("Difficulty Level not found");
    }
    await difficultyLevel.update(difficultyLevelData);
    const updatedDifficultyLevel = await DifficultyLevel.findByPk(
      difficultyLevelId
    );
    return updatedDifficultyLevel;
  } catch (error) {
    throw error;
  }
};

exports.deleteDifficultyLevel = async (difficultyLevelId) => {
  try {
    const difficultyLevel = await DifficultyLevel.findByPk(difficultyLevelId);
    if (!difficultyLevel) {
      return { message: "Difficulty Level not found" }; // Return object
    }

    // Kiểm tra xem độ khó có đang được sử dụng trong câu hỏi nào không
    const questionDifficultyLevels = await Question.findAll({
      where: { difficulty_level_id: difficultyLevelId },
    });

    if (questionDifficultyLevels.length > 0) {
      throw new Error(
        "Cannot delete Difficulty Level because it is associated with one or more questions"
      );
    }

    // Xóa câu hỏi
    await difficultyLevel.destroy();
    return { message: "Difficulty Level deleted successfully" }; // Return a success message
  } catch (error) {
    throw error; // Re-throw the error to be handled by the controller
  }
};

// Hàm tìm kiếm câu hỏi
exports.searchDifficultyLevels = async (searchTerm) => {
  try {
    const difficultyLevels = await DifficultyLevel.findAll({
      where: {
        [Sequelize.Op.or]: [
          { difficultyLevel_text: { [Sequelize.Op.like]: `%${searchTerm}%` } },
        ],
      },
    });
    return difficultyLevels;
  } catch (error) {
    throw error;
  }
};

exports.getDifficultyLevel = async (id) => {
  const difficultyLevel = await DifficultyLevel.findByPk(id);

  if (!difficultyLevel) {
    throw new Error("Difficulty Level not found");
  }

  return difficultyLevel;
};
