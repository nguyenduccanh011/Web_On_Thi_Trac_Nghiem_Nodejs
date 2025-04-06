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
    const difficultyLinks = await ExamDifficulty.findAll({
      where: { exam_id: examId },
    });

    if (!difficultyLinks || difficultyLinks.length === 0) {
      // Fallback: Lấy tất cả câu hỏi đã liên kết qua ExamQuestion
      console.warn(
        `No difficulty links found for exam ${examId}. Falling back to linked questions.`
      );
      const examQuestions = await ExamQuestion.findAll({
        where: { exam_id: examId },
        include: [
          {
            model: Question,
            as: "question",
            include: [
              { model: Answer, as: "answers" },
              // *** THÊM INCLUDE DifficultyLevel VÀO ĐÂY ***
              {
                model: DifficultyLevel,
                as: "difficult_level", // Alias từ Question.belongsTo
                attributes: ["difficult_level_text"], // Chỉ lấy tên độ khó
              },
              {
                model: ExamCategory,
                as: "category",
                attributes: ["category_name"],
              }, // Include category name
            ],
          },
        ],
        order: Sequelize.literal("RAND()"),
      });
      // Map kết quả để thêm trường 'difficulty' text
      const questionsWithDetails = examQuestions
        .map((eq) => {
          if (!eq.question) return null;
          const questionJson = eq.question.toJSON(); // Lấy object thuần túy
          // Lấy tên độ khó từ object lồng nhau
          questionJson.difficulty = eq.question.difficult_level
            ? eq.question.difficult_level.difficult_level_text
            : "N/A";
          return questionJson;
        })
        .filter((q) => q); // Lọc bỏ null nếu có lỗi

      return questionsWithDetails;
    }

    // --- Logic lấy câu hỏi theo distribution của difficultyLinks ---
    const exam = await Exam.findByPk(examId, { attributes: ["category_id"] });
    if (!exam) {
      throw new Error("Exam not found");
    }

    let allQuestions = [];
    const fetchedQuestionIds = new Set(); // Để tránh lấy trùng câu hỏi nếu có lỗi logic

    for (const link of difficultyLinks) {
      if (link.question_count <= 0) continue; // Bỏ qua nếu số lượng là 0

      const questions = await Question.findAll({
        where: {
          category_id: exam.category_id,
          difficult_level_id: link.difficult_level_id,
          question_id: { [Op.notIn]: Array.from(fetchedQuestionIds) }, // Tránh lấy lại ID đã có
        },
        include: [
          { model: Answer, as: "answers" },
          // *** THÊM INCLUDE DifficultyLevel VÀO ĐÂY ***
          {
            model: DifficultyLevel,
            as: "difficult_level", // Alias từ Question.belongsTo
            attributes: ["difficult_level_text"], // Chỉ lấy tên độ khó
          },
        ],
        order: Sequelize.literal("RAND()"), // MySQL random
        limit: link.question_count,
      });

      // Map kết quả để thêm trường 'difficulty' text và cập nhật Set ID đã fetch
      const questionsWithDifficultyName = questions.map((q) => {
        fetchedQuestionIds.add(q.question_id); // Thêm ID vào set
        const questionJson = q.toJSON(); // Lấy object thuần túy
        // Lấy tên độ khó từ object lồng nhau
        questionJson.difficulty = q.difficult_level
          ? q.difficult_level.difficult_level_text
          : "N/A";
        return questionJson;
      });

      allQuestions = allQuestions.concat(questionsWithDifficultyName);
    }

    // Optional: Trộn lại toàn bộ danh sách câu hỏi cuối cùng nếu cần
    // return _.shuffle(allQuestions);

    return allQuestions;
  } catch (error) {
    console.error(`Error getting questions for taking exam ${examId}:`, error);
    if (error.message.includes("is not associated")) {
      console.error(
        "ASSOCIATION ERROR: Check model definitions (Question, Answer, DifficultyLevel)."
      );
      throw new Error(`Configuration error: ${error.message}`);
    }
    throw error;
  }
};
