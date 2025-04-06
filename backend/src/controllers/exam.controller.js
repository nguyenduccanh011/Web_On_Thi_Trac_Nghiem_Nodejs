// src/controllers/exam.controller.js
const examService = require("../services/exam.service");
// const shuffleArray = require("lodash"); // Có thể không cần shuffle ở đây nữa nếu service làm

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

// Đổi tên hàm này để rõ ràng hơn cho route /take-exam
exports.getQuestionsForExamTake = async (req, res) => {
  try {
    const examIdParam = req.params.id; // Lấy từ params cho route /:id/take-exam
    const examId = parseInt(examIdParam, 10);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }

    const questions = await examService.getQuestionsForExamTake(examId);
    // Service đã random hoặc lấy theo thứ tự, không cần shuffle ở đây nữa trừ khi muốn trộn lại
    // const shuffledTasks = shuffleArray.shuffle(tasks);
    res.json(questions); // Trả về danh sách câu hỏi (đã bao gồm answers)
  } catch (error) {
    console.error(
      `Controller error getQuestionsForExamTake (examId: ${req.params.id}):`,
      error
    );
    // Phân biệt lỗi Not Found và lỗi khác
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
    const exam = await examService.getExamById(examId); // Chỉ lấy thông tin cơ bản
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
    const examData = req.body; // Chỉ chứa { exam_name, description, category_id }
    // Validation cơ bản
    if (!examData.exam_name || !examData.category_id) {
      return res
        .status(400)
        .json({ message: "Exam name and category ID are required." });
    }

    const newExam = await examService.createExam(examData); // Chỉ tạo exam cơ bản
    res.status(201).json(newExam); // Trả về exam vừa tạo (chưa có questions/difficulties)
  } catch (error) {
    console.error("Controller error createExam:", error);
    // Nếu lỗi là validation từ service
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
    const examData = req.body; // Chỉ chứa { exam_name, description, category_id }
    // Validation cơ bản
    if (!examData.exam_name || !examData.category_id) {
      return res
        .status(400)
        .json({
          message: "Exam name and category ID are required for update.",
        });
    }

    const updatedExam = await examService.updateExam(examId, examData); // Chỉ cập nhật cơ bản
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

// *** CONTROLLER MỚI: Thiết lập/thay thế câu hỏi cho exam ***
exports.setExamQuestions = async (req, res) => {
  try {
    const examIdParam = req.params.examId; // Lấy từ param của route mới
    const examId = parseInt(examIdParam, 10);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }

    const { questionIds } = req.body; // Lấy mảng ID từ body

    // Validation mảng questionIds
    if (!Array.isArray(questionIds)) {
      return res.status(400).json({ message: "questionIds must be an array." });
    }
    // Cho phép mảng rỗng, nhưng nếu không rỗng thì phải là số nguyên dương
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

// *** CONTROLLER MỚI: Thiết lập/thay thế liên kết độ khó cho exam ***
exports.setExamDifficultyLinks = async (req, res) => {
  try {
    const examIdParam = req.params.examId; // Lấy từ param của route mới
    const examId = parseInt(examIdParam, 10);
    if (isNaN(examId)) {
      return res
        .status(400)
        .json({
          message: "Invalid parameter format: examId must be an integer.",
        });
    }

    const { links } = req.body; // Lấy mảng links từ body [{ difficult_level_id, question_count }]

    // Validation mảng links
    if (!Array.isArray(links)) {
      return res.status(400).json({ message: "links must be an array." });
    }
    // Kiểm tra cấu trúc từng link (có thể làm kỹ hơn)
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
    // Validation kiểu dữ liệu trong service sẽ chặt chẽ hơn

    const result = await examService.setExamDifficultyLinks(examId, links);
    res.status(200).json(result); // Trả về { success: true, message: '...' }
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
