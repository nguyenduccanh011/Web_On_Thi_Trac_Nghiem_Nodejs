// src/services/exam_difficulty.service.js
const ExamDifficulty = require("../models/exam_difficulty.model"); // Model từ examDiffModel
const Exam = require("../models/exam.model"); // Model Exam mới (newExamModel)
const DifficultyLevel = require("../models/difficulty_level.model"); // Model DifficultyLevel (diffModel)

// 1. Lấy tất cả các bản ghi ExamDifficulty (liên kết giữa Exam và DifficultyLevel)
exports.getAllExamDifficulties = async () => {
  try {
    const examDifficulties = await ExamDifficulty.findAll({
      include: [
        { model: Exam, as: "exam" }, // Giả sử bạn định nghĩa alias 'exam' trong quan hệ
        { model: DifficultyLevel, as: "difficultyLevel" }, // Giả sử alias là 'difficultyLevel'
      ],
      // Sắp xếp nếu cần, ví dụ: theo exam_id rồi đến difficult_level_id
      order: [
        ["exam_id", "ASC"],
        ["difficult_level_id", "ASC"],
      ],
    });
    return examDifficulties;
  } catch (error) {
    console.error("Error fetching all exam difficulties:", error); // Log lỗi chi tiết hơn
    throw error; // Ném lỗi để controller xử lý
  }
};

// 2. Lấy một bản ghi ExamDifficulty cụ thể bằng khóa chính phức hợp
exports.getExamDifficultyByCompositeId = async (examId, diffLevelId) => {
  try {
    const examDifficulty = await ExamDifficulty.findOne({
      where: {
        exam_id: examId,
        difficult_level_id: diffLevelId,
      },
      include: [
        { model: Exam, as: "exam" },
        { model: DifficultyLevel, as: "difficultyLevel" },
      ],
    });
    // Không cần throw lỗi nếu không tìm thấy, trả về null để controller kiểm tra
    // if (!examDifficulty) {
    //   throw new Error('ExamDifficulty record not found');
    // }
    return examDifficulty;
  } catch (error) {
    console.error(
      `Error fetching exam difficulty for exam ${examId}, level ${diffLevelId}:`,
      error
    );
    throw error;
  }
};

// 3. Tạo một liên kết ExamDifficulty mới
exports.createExamDifficulty = async (data) => {
  // data nên chứa: exam_id, difficult_level_id, question_count
  const { exam_id, difficult_level_id, question_count } = data;

  if (
    exam_id === undefined ||
    difficult_level_id === undefined ||
    question_count === undefined
  ) {
    throw new Error(
      "Missing required fields: exam_id, difficult_level_id, question_count"
    );
  }

  try {
    const newExamDifficulty = await ExamDifficulty.create({
      exam_id,
      difficult_level_id,
      question_count,
    });
    // Có thể muốn lấy lại bản ghi với includes sau khi tạo
    // return exports.getExamDifficultyByCompositeId(newExamDifficulty.exam_id, newExamDifficulty.difficult_level_id);
    return newExamDifficulty; // Hoặc trả về bản ghi vừa tạo trực tiếp
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error(
        `Association between Exam ID ${exam_id} and Difficulty Level ID ${difficult_level_id} already exists.`
      );
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new Error(
        `Invalid Exam ID ${exam_id} or Difficulty Level ID ${difficult_level_id}.`
      );
    }
    console.error("Error creating exam difficulty:", error);
    throw error; // Ném lỗi gốc hoặc lỗi đã xử lý
  }
};

// 4. Cập nhật thông tin của một ExamDifficulty (chủ yếu là question_count)
exports.updateExamDifficulty = async (examId, diffLevelId, updateData) => {
  // updateData thường chỉ chứa { question_count: newValue }
  const { question_count } = updateData;

  if (question_count === undefined) {
    throw new Error("Missing required field for update: question_count");
  }
  if (
    typeof question_count !== "number" ||
    !Number.isInteger(question_count) ||
    question_count < 0
  ) {
    throw new Error(
      "Invalid value for question_count. It must be a non-negative integer."
    );
  }

  try {
    const examDifficulty = await ExamDifficulty.findOne({
      where: {
        exam_id: examId,
        difficult_level_id: diffLevelId,
      },
    });

    if (!examDifficulty) {
      // Trả về null hoặc throw lỗi tùy theo logic bạn muốn ở controller
      return null;
      // throw new Error('ExamDifficulty record not found for update');
    }

    // Chỉ cập nhật question_count
    await examDifficulty.update({ question_count });

    // Trả về bản ghi đã cập nhật (không cần include lại nếu chỉ cập nhật 1 trường)
    return examDifficulty;

    // Hoặc lấy lại thông tin đầy đủ nếu cần
    // return exports.getExamDifficultyByCompositeId(examId, diffLevelId);
  } catch (error) {
    console.error(
      `Error updating exam difficulty for exam ${examId}, level ${diffLevelId}:`,
      error
    );
    throw error;
  }
};

// 5. Xóa một liên kết ExamDifficulty
exports.deleteExamDifficulty = async (examId, diffLevelId) => {
  try {
    const examDifficulty = await ExamDifficulty.findOne({
      where: {
        exam_id: examId,
        difficult_level_id: diffLevelId,
      },
    });

    if (!examDifficulty) {
      return { success: false, message: "ExamDifficulty record not found" };
    }

    await examDifficulty.destroy();
    return {
      success: true,
      message: "ExamDifficulty record deleted successfully",
    };
  } catch (error) {
    console.error(
      `Error deleting exam difficulty for exam ${examId}, level ${diffLevelId}:`,
      error
    );
    throw error; // Ném lỗi để controller xử lý
  }
};

// 6. Lấy tất cả các mức độ khó và số lượng câu hỏi cho một Exam cụ thể
exports.getDifficultiesForExam = async (examId) => {
  try {
    const difficulties = await ExamDifficulty.findAll({
      where: { exam_id: examId },
      include: [
        // Chỉ cần include DifficultyLevel vì examId đã biết
        { model: DifficultyLevel, as: "difficultyLevel" },
      ],
      order: [["difficult_level_id", "ASC"]], // Sắp xếp theo ID mức độ khó
    });
    return difficulties; // Trả về danh sách các bản ghi ExamDifficulty kèm DifficultyLevel
  } catch (error) {
    console.error(`Error fetching difficulties for exam ${examId}:`, error);
    throw error;
  }
};

// 7. Lấy tất cả các bài thi sử dụng một Mức độ khó cụ thể
exports.getExamsForDifficulty = async (diffLevelId) => {
  try {
    const exams = await ExamDifficulty.findAll({
      where: { difficult_level_id: diffLevelId },
      include: [
        // Chỉ cần include Exam vì diffLevelId đã biết
        { model: Exam, as: "exam" },
      ],
      order: [["exam_id", "ASC"]], // Sắp xếp theo ID bài thi
    });
    return exams; // Trả về danh sách các bản ghi ExamDifficulty kèm Exam
  } catch (error) {
    console.error(
      `Error fetching exams for difficulty level ${diffLevelId}:`,
      error
    );
    throw error;
  }
};

// Có thể thêm các hàm khác nếu cần, ví dụ: tính tổng số câu hỏi cho một bài thi
// exports.getTotalQuestionCountForExam = async (examId) => { ... }
