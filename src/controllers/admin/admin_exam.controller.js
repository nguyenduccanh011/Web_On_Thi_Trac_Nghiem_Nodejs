// src/controllers/admin/admin_exam.controller.js
const adminExamService = require('../../services/admin/admin_exam.service');

// Các hàm CRUD cho Exam, tương tự như exam.controller.js, nhưng có thể có thêm logic
// liên quan đến quyền admin (ví dụ: không cần kiểm tra user ID khi lấy tất cả đề thi)

exports.getAllExams = async (req, res) => {
  try {
    const exams = await adminExamService.getAllExams(); // Hàm này có thể khác với getAllExams của user
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... (getExamById, createExam, updateExam, deleteExam - Tương tự như exam.controller.js)
// Chú ý: Không cần middleware authMiddleware.verifyToken và adminMiddleware.isAdmin ở đây
// vì đã được áp dụng ở routes rồi.

exports.createExam = async (req, res) => {
    try {
        const examData = req.body;
        const newExam = await adminExamService.createExam(examData);
        res.status(201).json(newExam);
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

exports.getExamById = async (req, res) => {
    try {
      const examId = req.params.id;
      const exam = await adminExamService.getExamById(examId);
      res.status(200).json(exam);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 Not Found nếu không tìm thấy
    }
}

exports.updateExam = async (req, res) => {
    try {
        const examId = req.params.id;
        const examData = req.body;
        const updatedExam = await adminExamService.updateExam(examId, examData);
        res.status(200).json(updatedExam);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteExam = async (req, res) => {
    try{
        const examId = req.params.id;
        await adminExamService.deleteExam(examId);
        res.status(204).json({message: "Exam deleted successfully"});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}