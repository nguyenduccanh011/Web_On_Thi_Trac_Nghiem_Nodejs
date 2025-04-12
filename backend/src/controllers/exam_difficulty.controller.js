const examDiffService = require("../services/exam_difficulty.service");

exports.getAllExamDifficulties = async (req, res) => {
  try {
    const examDifficulties = await examDiffService.getAllExamDifficulties();
    res.json(examDifficulties);
  } catch (error) {
    console.error("Error in getAllExamDifficulties controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

exports.getExamDifficultyByCompositeId = async (req, res) => {
  try {
    // Parse và kiểm tra ID từ params trực tiếp
    const examIdParam = req.params.examId;
    const diffLevelIdParam = req.params.diffLevelId;

    const examId = parseInt(examIdParam, 10);
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    const examDifficulty = await examDiffService.getExamDifficultyByCompositeId(
      examId,
      diffLevelId
    );

    if (!examDifficulty) {
      return res
        .status(404)
        .json({ message: "Exam-Difficulty association not found" });
    }
    res.json(examDifficulty);
  } catch (error) {
    console.error("Error in getExamDifficultyByCompositeId controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

exports.createExamDifficulty = async (req, res) => {
  try {
    const { exam_id, difficult_level_id, question_count } = req.body;
    if (
      exam_id === undefined ||
      difficult_level_id === undefined ||
      question_count === undefined
    ) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: exam_id, difficult_level_id, question_count",
        });
    }
    if (typeof exam_id !== "number" || !Number.isInteger(exam_id)) {
      return res
        .status(400)
        .json({ message: "Invalid value for exam_id. It must be an integer." });
    }
    if (
      typeof difficult_level_id !== "number" ||
      !Number.isInteger(difficult_level_id)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for difficult_level_id. It must be an integer.",
        });
    }
    if (
      typeof question_count !== "number" ||
      !Number.isInteger(question_count) ||
      question_count < 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for question_count. It must be a non-negative integer.",
        });
    }

    const newExamDifficulty = await examDiffService.createExamDifficulty({
      exam_id,
      difficult_level_id,
      question_count,
    });

    res.status(201).json(newExamDifficulty);
  } catch (error) {
    console.error("Error in createExamDifficulty controller:", error);
    if (
      error.message.includes("already exists") ||
      error.message.includes("Invalid Exam ID or Difficulty Level ID")
    ) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({
        message:
          error.message ||
          "An unexpected error occurred while creating the association.",
      });
  }
};

// Yêu cầu route dạng: /exams/:examId/difficulties/:diffLevelId
exports.updateExamDifficulty = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const diffLevelIdParam = req.params.diffLevelId;
    const { question_count } = req.body;

    const examId = parseInt(examIdParam, 10);
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    if (question_count === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required field for update: question_count" });
    }
    if (
      typeof question_count !== "number" ||
      !Number.isInteger(question_count) ||
      question_count < 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for question_count. It must be a non-negative integer.",
        });
    }

    const updatedExamDifficulty = await examDiffService.updateExamDifficulty(
      examId,
      diffLevelId,
      { question_count } 
    );

    if (!updatedExamDifficulty) {
      return res
        .status(404)
        .json({ message: "Exam-Difficulty association not found for update" });
    }

    res.json(updatedExamDifficulty); 
  } catch (error) {
    console.error("Error in updateExamDifficulty controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 5. Xóa một liên kết Exam-Difficulty
// Yêu cầu route dạng: /exams/:examId/difficulties/:diffLevelId
exports.deleteExamDifficulty = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const diffLevelIdParam = req.params.diffLevelId;

    const examId = parseInt(examIdParam, 10);
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    const result = await examDiffService.deleteExamDifficulty(
      examId,
      diffLevelId
    );

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteExamDifficulty controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 6. Lấy tất cả mức độ khó và số lượng câu hỏi cho một Exam cụ thể
// Yêu cầu route dạng: /exams/:examId/difficulties
exports.getDifficultiesForExam = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const examId = parseInt(examIdParam, 10);

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }

    const difficulties = await examDiffService.getDifficultiesForExam(examId);
    res.json(difficulties);
  } catch (error) {
    console.error("Error in getDifficultiesForExam controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// 7. Lấy tất cả các bài thi sử dụng một Mức độ khó cụ thể
// Yêu cầu route dạng: /difficulty-levels/:diffLevelId/exams
exports.getExamsForDifficulty = async (req, res) => {
  try {
    const diffLevelIdParam = req.params.diffLevelId;
    const diffLevelId = parseInt(diffLevelIdParam, 10);

    if (isNaN(diffLevelId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: diffLevelId must be an integer.",
        });
    }

    const exams = await examDiffService.getExamsForDifficulty(diffLevelId);
    res.json(exams); // Trả về danh sách tìm được
  } catch (error) {
    console.error("Error in getExamsForDifficulty controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};
