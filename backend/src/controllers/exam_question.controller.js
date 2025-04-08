const examQuestionService = require("../services/exam_question.service");

exports.getAllExamQuestions = async (req, res) => {
  try {
    const examQuestions = await examQuestionService.getAllExamQuestions();
    res.json(examQuestions);
  } catch (error) {
    console.error("Error in getAllExamQuestions controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};


exports.getExamQuestionById = async (req, res) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid parameter format: id must be an integer." });
    }

    const examQuestion = await examQuestionService.getExamQuestionById(id);

    if (!examQuestion) {
      return res.status(404).json({ message: "Exam-Question link not found" });
    }
    res.json(examQuestion);
  } catch (error) {
    console.error("Error in getExamQuestionById controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};


exports.createExamQuestion = async (req, res) => {
  try {
    const { exam_id, question_id, question_order } = req.body;

    if (exam_id === undefined || question_id === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required fields: exam_id, question_id" });
    }
    if (typeof exam_id !== "number" || !Number.isInteger(exam_id)) {
      return res
        .status(400)
        .json({ message: "Invalid value for exam_id. It must be an integer." });
    }
    if (typeof question_id !== "number" || !Number.isInteger(question_id)) {
      return res
        .status(400)
        .json({
          message: "Invalid value for question_id. It must be an integer.",
        });
    }
    if (
      question_order !== undefined &&
      question_order !== null &&
      (!Number.isInteger(question_order) || question_order < 0)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for question_order. It must be a non-negative integer or null.",
        });
    }

    const newExamQuestion = await examQuestionService.createExamQuestion({
      exam_id,
      question_id,
      question_order,
    });

    res.status(201).json(newExamQuestion);
  } catch (error) {
    console.error("Error in createExamQuestion controller:", error);
    if (
      error.message.includes("already exists") ||
      error.message.includes("Invalid Exam ID or Question ID")
    ) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({
        message:
          error.message ||
          "An unexpected error occurred while creating the link.",
      });
  }
};


exports.updateExamQuestion = async (req, res) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);
    const { question_order } = req.body; 

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid parameter format: id must be an integer." });
    }

    if (
      question_order !== undefined &&
      question_order !== null &&
      (!Number.isInteger(question_order) || question_order < 0)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid value for question_order. It must be a non-negative integer or null.",
        });
    }
    const updateData = {};
    if (req.body.hasOwnProperty("question_order")) {
      updateData.question_order = question_order;
    } else {

      const currentLink = await examQuestionService.getExamQuestionById(id);
      if (!currentLink)
        return res
          .status(404)
          .json({ message: "Exam-Question link not found" });
      return res.json(currentLink); 
    }

    const updatedExamQuestion = await examQuestionService.updateExamQuestion(
      id,
      updateData
    );

    if (!updatedExamQuestion) {
      return res
        .status(404)
        .json({ message: "Exam-Question link not found for update" });
    }

    res.json(updatedExamQuestion);
  } catch (error) {
    console.error("Error in updateExamQuestion controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};


exports.deleteExamQuestion = async (req, res) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Invalid parameter format: id must be an integer." });
    }

    const result = await examQuestionService.deleteExamQuestion(id);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(204).send(); 
  } catch (error) {
    console.error("Error in deleteExamQuestion controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};


exports.getQuestionsForExam = async (req, res) => {
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

    const questions = await examQuestionService.getQuestionsForExam(examId);
    res.json(questions);
  } catch (error) {
    console.error("Error in getQuestionsForExam controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};


exports.getExamsForQuestion = async (req, res) => {
  try {
    const questionIdParam = req.params.questionId;
    const questionId = parseInt(questionIdParam, 10);

    if (isNaN(questionId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: questionId must be an integer.",
        });
    }

    const exams = await examQuestionService.getExamsForQuestion(questionId);
    res.json(exams);
  } catch (error) {
    console.error("Error in getExamsForQuestion controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};


exports.addQuestionsToExam = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const examId = parseInt(examIdParam, 10);
    const { questionIds } = req.body;

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res
        .status(400)
        .json({ message: "questionIds must be a non-empty array." });
    }
    // Thêm validation kiểm tra các ID trong mảng là số nguyên
    if (!questionIds.every((id) => Number.isInteger(id) && id > 0)) {
      return res
        .status(400)
        .json({
          message: "All question IDs in the array must be positive integers.",
        });
    }

    const createdLinks = await examQuestionService.addQuestionsToExam(
      examId,
      questionIds
    );
    res.status(201).json(createdLinks);
  } catch (error) {
    console.error("Error in addQuestionsToExam controller:", error);
    if (
      error.message.includes("already exist") ||
      error.message.includes(
        "Invalid Exam ID or one or more invalid Question IDs"
      )
    ) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

exports.removeQuestionsFromExam = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const examId = parseInt(examIdParam, 10);
    const { questionIds } = req.body; 
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res
        .status(400)
        .json({
          message:
            "questionIds must be a non-empty array sent in the request body.",
        });
    }
    if (!questionIds.every((id) => Number.isInteger(id) && id > 0)) {
      return res
        .status(400)
        .json({
          message: "All question IDs in the array must be positive integers.",
        });
    }

    const result = await examQuestionService.removeQuestionsFromExam(
      examId,
      questionIds
    );
    res
      .status(200)
      .json({
        message: `${result.deletedCount} links removed successfully.`,
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    console.error("Error in removeQuestionsFromExam controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};


exports.updateQuestionOrderForExam = async (req, res) => {
  try {
    const examIdParam = req.params.examId;
    const examId = parseInt(examIdParam, 10);
    const { orderedQuestionIds } = req.body;

    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }
    if (!Array.isArray(orderedQuestionIds)) {
      return res
        .status(400)
        .json({ message: "orderedQuestionIds must be an array." });
    }
    if (!orderedQuestionIds.every((id) => Number.isInteger(id) && id > 0)) {
      return res
        .status(400)
        .json({
          message:
            "All question IDs in the order array must be positive integers.",
        });
    }

    const result = await examQuestionService.updateQuestionOrderForExam(
      examId,
      orderedQuestionIds
    );
    res.status(200).json(result); 
  } catch (error) {
    console.error("Error in updateQuestionOrderForExam controller:", error);
    res
      .status(500)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};
