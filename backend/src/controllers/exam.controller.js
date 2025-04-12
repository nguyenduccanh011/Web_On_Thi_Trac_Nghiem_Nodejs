const examService = require("../services/exam.service");

exports.getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams();
    res.json(exams);
  } catch (error) {
    console.error("Controller error getAllExams:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch exams." });
  }
};

exports.getQuestionsForExamTake = async (req, res) => {
  try {
    const examIdParam = req.params.id; 
    const examId = parseInt(examIdParam, 10);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }

    const questions = await examService.getQuestionsForExamTake(examId);
    res.json(questions);
  } catch (error) {
    console.error(
      `Controller error getQuestionsForExamTake (examId: ${req.params.id}):`,
      error
    );
    if (error.message.toLowerCase().includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({
          message: error.message || "Failed to get questions for exam.",
        });
    }
  }
};

exports.getExamById = async (req, res) => {
  try {
    const examIdParam = req.params.id;
    const examId = parseInt(examIdParam, 10);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    const exam = await examService.getExamById(examId); 
    res.json(exam);
  } catch (error) {
    console.error(
      `Controller error getExamById (examId: ${req.params.id}):`,
      error
    );
    if (error.message.toLowerCase().includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to fetch exam details." });
    }
  }
};

exports.createExam = async (req, res) => {
  try {
    const examData = req.body; 
    if (!examData.exam_name || !examData.category_id) {
      return res
        .status(400)
        .json({ message: "Exam name and category ID are required." });
    }

    const newExam = await examService.createExam(examData); 
    res.status(201).json(newExam);
  } catch (error) {
    console.error("Controller error createExam:", error);
    if (error.message.includes("ValidationError")) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to create exam." });
    }
  }
};

exports.updateExam = async (req, res) => {
  try {
    const examIdParam = req.params.id;
    const examId = parseInt(examIdParam, 10);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    const examData = req.body; 
    if (!examData.exam_name || !examData.category_id) {
      return res
        .status(400)
        .json({
          message: "Exam name and category ID are required for update.",
        });
    }

    const updatedExam = await examService.updateExam(examId, examData);
    res.json(updatedExam);
  } catch (error) {
    console.error(
      `Controller error updateExam (examId: ${req.params.id}):`,
      error
    );
    if (error.message.toLowerCase().includes("not found")) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("ValidationError")) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to update exam." });
    }
  }
};

exports.setExamQuestions = async (req, res) => {
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

    const { questionIds } = req.body; 
    if (!Array.isArray(questionIds)) {
      return res.status(400).json({ message: "questionIds must be an array." });
    }
    if (
      questionIds.length > 0 &&
      !questionIds.every((id) => Number.isInteger(id) && id > 0)
    ) {
      return res
        .status(400)
        .json({
          message: "All question IDs in the array must be positive integers.",
        });
    }

    const result = await examService.setExamQuestions(examId, questionIds);
    res.status(200).json(result); // Trả về { success: true, message: '...' }
  } catch (error) {
    console.error(
      `Controller error setExamQuestions (examId: ${req.params.examId}):`,
      error
    );
    if (
      error.message.toLowerCase().includes("not found") ||
      error.message.includes("do not exist")
    ) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({
          message: error.message || "Failed to set questions for exam.",
        });
    }
  }
};

exports.setExamDifficultyLinks = async (req, res) => {
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

    const { links } = req.body; 

    if (!Array.isArray(links)) {
      return res.status(400).json({ message: "links must be an array." });
    }
    if (
      links.length > 0 &&
      !links.every(
        (link) =>
          link.hasOwnProperty("difficult_level_id") &&
          link.hasOwnProperty("question_count")
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Each link object must have difficult_level_id and question_count properties.",
        });
    }

    const result = await examService.setExamDifficultyLinks(examId, links);
    res.status(200).json(result); 
  } catch (error) {
    console.error(
      `Controller error setExamDifficultyLinks (examId: ${req.params.examId}):`,
      error
    );
    if (
      error.message.toLowerCase().includes("not found") ||
      error.message.includes("do not exist")
    ) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("Invalid data")) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({
          message: error.message || "Failed to set difficulty links for exam.",
        });
    }
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const examIdParam = req.params.id;
    const examId = parseInt(examIdParam, 10);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    const result = await examService.deleteExam(examId);
    res.status(200).json(result); // Trả về message thành công từ service
  } catch (error) {
    console.error(
      `Controller error deleteExam (examId: ${req.params.id}):`,
      error
    );
    if (error.message.toLowerCase().includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete exam." });
    }
  }
};

// Bỏ hàm getQuestionsForExam ở controller vì không có route tương ứng nữa
// Nếu cần thì tạo route mới và gọi service.getQuestionsForExamTake
// exports.getQuestionsForExam = async (req, res) => { ... };
