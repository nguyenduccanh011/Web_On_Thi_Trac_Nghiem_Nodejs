// src/services/exam.service.js
const Exam = require("../models/exam.model");
const ExamQuestion = require("../models/exam_question.model");
const ExamDifficulty = require("../models/exam_difficulty.model"); // *** THÊM IMPORT ***
const Question = require("../models/question.model");
const ExamCategory = require("../models/exam_category.model");
const DifficultyLevel = require("../models/difficulty_level.model");
const Answer = require("../models/answer.model");
const { sequelize } = require("../config/database");
const { Sequelize, Op } = require("sequelize"); // Import Op nếu cần

exports.getAllExams = async () => {
  try {
    const exams = await Exam.findAll({
      include: [
        { model: ExamCategory, as: "category" },
        // Có thể không cần include questions ở đây nếu danh sách quá lớn
        // { model: Question, as: 'questions', through: { attributes: [] } }
      ],
      order: [["created_at", "DESC"]], // Sắp xếp mới nhất lên đầu
    });
    return exams;
  } catch (error) {
    console.error("Error fetching all exams:", error);
    throw error;
  }
};

exports.getExamById = async (examId) => {
  try {
    const exam = await Exam.findByPk(examId, {
      include: [
        { model: ExamCategory, as: "category" },
        // Không cần include questions/difficulties ở đây nữa,
        // vì sẽ có các hàm riêng để lấy chúng khi cần chỉnh sửa chi tiết
        // { model: Question, as: 'questions', through: { attributes: ['question_order'] } },
        // { model: DifficultyLevel, as: 'difficultyLevels', through: { attributes: ['question_count'] } } // Nếu có định nghĩa alias này
      ],
    });

    if (!exam) {
      throw new Error("Exam not found");
    }
    return exam;
  } catch (error) {
    console.error(`Error fetching exam by ID ${examId}:`, error);
    throw error;
  }
};

// Chỉ tạo thông tin Exam cơ bản
exports.createExam = async (examData) => {
  try {
    const newExam = await Exam.create({
      exam_name: examData.exam_name,
      description: examData.description,
      category_id: examData.category_id,
    });
    // Trả về exam vừa tạo (chưa có questions hay difficulties)
    return newExam;
  } catch (error) {
    console.error("Error creating exam:", error);
    // Bắt lỗi validation nếu có
    if (error.name === "SequelizeValidationError") {
      throw new Error(error.errors.map((e) => e.message).join(", "));
    }
    throw error;
  }
};

// Chỉ cập nhật thông tin Exam cơ bản
exports.updateExam = async (examId, examData) => {
  const transaction = await sequelize.transaction(); // Dùng transaction
  try {
    const exam = await Exam.findByPk(examId, { transaction });
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Cập nhật thông tin cơ bản
    await exam.update(
      {
        exam_name: examData.exam_name,
        description: examData.description,
        category_id: examData.category_id,
      },
      { transaction }
    );

    await transaction.commit();

    // Trả về exam đã cập nhật (chỉ thông tin cơ bản)
    return exam;
  } catch (error) {
    await transaction.rollback();
    console.error(`Error updating exam ${examId}:`, error);
    if (error.name === "SequelizeValidationError") {
      throw new Error(error.errors.map((e) => e.message).join(", "));
    }
    throw error;
  }
};

// *** HÀM MỚI: Thiết lập/Thay thế danh sách câu hỏi cho Exam ***
exports.setExamQuestions = async (examId, questionIds = []) => {
  const transaction = await sequelize.transaction();
  try {
    // Kiểm tra exam tồn tại (tùy chọn)
    const examExists = await Exam.count({
      where: { exam_id: examId },
      transaction,
    });
    if (examExists === 0) {
      throw new Error("Exam not found");
    }

    // 1. Xóa tất cả liên kết câu hỏi cũ của exam này
    await ExamQuestion.destroy({ where: { exam_id: examId }, transaction });

    // 2. Nếu có danh sách câu hỏi mới, tạo liên kết mới
    if (questionIds && questionIds.length > 0) {
      // Kiểm tra xem tất cả questionId có tồn tại không (quan trọng)
      const existingQuestions = await Question.count({
        where: { question_id: { [Op.in]: questionIds } },
        transaction,
      });
      if (existingQuestions !== questionIds.length) {
        throw new Error("One or more provided Question IDs do not exist.");
      }

      const examQuestionsData = questionIds.map((questionId, index) => ({
        exam_id: examId,
        question_id: questionId,
        question_order: index + 1, // Gán thứ tự dựa trên vị trí trong mảng
      }));
      await ExamQuestion.bulkCreate(examQuestionsData, { transaction });
    }

    await transaction.commit();
    return {
      success: true,
      message: `Questions updated successfully for exam ${examId}`,
    };
  } catch (error) {
    await transaction.rollback();
    console.error(`Error setting questions for exam ${examId}:`, error);
    throw error;
  }
};

// *** HÀM MỚI: Thiết lập/Thay thế danh sách liên kết độ khó cho Exam ***
exports.setExamDifficultyLinks = async (examId, difficultyLinks = []) => {
  const transaction = await sequelize.transaction();
  try {
    // Kiểm tra exam tồn tại (tùy chọn)
    const examExists = await Exam.count({
      where: { exam_id: examId },
      transaction,
    });
    if (examExists === 0) {
      throw new Error("Exam not found");
    }

    // 1. Xóa tất cả liên kết độ khó cũ của exam này
    await ExamDifficulty.destroy({ where: { exam_id: examId }, transaction });

    // 2. Nếu có danh sách link mới, tạo liên kết mới
    if (difficultyLinks && difficultyLinks.length > 0) {
      // Validate dữ liệu đầu vào
      const validLinks = [];
      const difficultyIds = difficultyLinks.map(
        (link) => link.difficult_level_id
      );

      // Kiểm tra các difficulty level id có tồn tại
      const existingLevels = await DifficultyLevel.count({
        where: { difficult_level_id: { [Op.in]: difficultyIds } },
        transaction,
      });
      if (existingLevels !== new Set(difficultyIds).size) {
        // Dùng Set để loại bỏ ID trùng lặp khi kiểm tra
        throw new Error(
          "One or more provided Difficulty Level IDs do not exist."
        );
      }

      for (const link of difficultyLinks) {
        if (
          link.difficult_level_id &&
          link.question_count >= 0 &&
          Number.isInteger(link.question_count)
        ) {
          validLinks.push({
            exam_id: examId,
            difficult_level_id: link.difficult_level_id,
            question_count: link.question_count,
          });
        } else {
          console.warn(
            `Invalid difficulty link data skipped for exam ${examId}:`,
            link
          );
          // Hoặc ném lỗi nếu muốn chặt chẽ hơn
          // throw new Error(`Invalid data in difficulty link: ${JSON.stringify(link)}`);
        }
      }

      if (validLinks.length > 0) {
        await ExamDifficulty.bulkCreate(validLinks, { transaction });
      }
    }

    await transaction.commit();
    return {
      success: true,
      message: `Difficulty links updated successfully for exam ${examId}`,
    };
  } catch (error) {
    await transaction.rollback();
    console.error(`Error setting difficulty links for exam ${examId}:`, error);
    throw error;
  }
};

// Giữ lại hàm delete, đảm bảo xóa liên kết trước
exports.deleteExam = async (examId) => {
  const transaction = await sequelize.transaction();
  try {
    const exam = await Exam.findByPk(examId, { transaction });
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Xóa các liên kết trước
    await ExamQuestion.destroy({ where: { exam_id: examId }, transaction });
    await ExamDifficulty.destroy({ where: { exam_id: examId }, transaction }); // *** THÊM XÓA LIÊN KẾT ĐỘ KHÓ ***
    // Có thể cần xóa cả ExamAttempt liên quan

    // Xóa đề thi
    await exam.destroy({ transaction });

    await transaction.commit();
    return { message: "Exam deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    console.error(`Error deleting exam ${examId}:`, error);
    throw error;
  }
};

// Hàm lấy câu hỏi random - giữ lại nếu route /take-exam vẫn dùng
// Lưu ý: Hàm này đang không nhất quán với cấu trúc model/liên kết khác
exports.getQuestionsForExamTake = async (examId) => {
  try {
    // Lấy thông tin các liên kết difficulty của exam này
    const difficultyLinks = await ExamDifficulty.findAll({
      where: { exam_id: examId },
    });
    if (!difficultyLinks || difficultyLinks.length === 0) {
      // Hoặc lấy tất cả câu hỏi đã liên kết nếu không dùng difficulty link?
      // throw new Error("No difficulty distribution found for this exam.");
      // Fallback: Lấy tất cả câu hỏi đã liên kết qua ExamQuestion
      const examQuestions = await ExamQuestion.findAll({
        where: { exam_id: examId },
        include: [
          {
            model: Question,
            as: "question",
            include: [{ model: Answer, as: "answers" }],
          },
        ],
        order: [["question_order", "ASC"]], // Sắp xếp nếu có order
      });
      return examQuestions.map((eq) => eq.question); // Trả về mảng Question
    }

    // Lấy exam category_id
    const exam = await Exam.findByPk(examId, { attributes: ["category_id"] });
    if (!exam) {
      throw new Error("Exam not found");
    }

    let allQuestions = [];

    // Lặp qua từng difficulty link để lấy số lượng câu hỏi tương ứng
    for (const link of difficultyLinks) {
      const questions = await Question.findAll({
        where: {
          category_id: exam.category_id,
          difficult_level_id: link.difficult_level_id, // Dùng ID thay vì text
        },
        include: [{ model: Answer, as: "answers" }],
        order: Sequelize.literal("RAND()"), // MySQL random
        limit: link.question_count, // Lấy đúng số lượng yêu cầu
      });
      allQuestions = allQuestions.concat(questions);
    }

    // Có thể cần trộn lại allQuestions lần nữa nếu muốn thứ tự hoàn toàn ngẫu nhiên
    // return _.shuffle(allQuestions); // Nếu dùng lodash

    return allQuestions;
  } catch (error) {
    console.error(`Error getting questions for taking exam ${examId}:`, error);
    throw error;
  }
};
