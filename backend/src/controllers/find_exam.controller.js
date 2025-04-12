const find_examService = require("../services/find_exam.service");


exports.searchExams = async (req, res) => {
  try {
    const { exam_name } = req.query;

    if (!exam_name || exam_name.trim() === "") {
      return res.status(400).json({ message: "exam_name is required for searching" });
    }

    const exams = await find_examService.findExamByName(exam_name);
    if (exams.length === 0) {
      return res.status(404).json({ message: "No exams found" });
    }
    // Chỉ cần trả về danh sách exam cơ bản, không cần thông tin chi tiết 
    res.json(exams);
  } catch (error) {
    console.error("Error searching exams:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
