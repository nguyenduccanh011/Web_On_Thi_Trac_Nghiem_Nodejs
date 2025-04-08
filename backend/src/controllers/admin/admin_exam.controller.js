const adminExamService = require('../../services/admin/admin_exam.service');


exports.getAllExams = async (req, res) => {
  try {
    const exams = await adminExamService.getAllExams(); 
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
      res.status(404).json({ message: error.message }); 
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