// src/services/exam_question.service.js
const ExamQuestion = require("../models/exam_question.model"); // Model từ examQuestionModel
const Exam = require("../models/exam.model");
const Question = require("../models/question.model");
const Answer = require("../models/answer.model"); // Import Answer nếu muốn include vào Question
const { Sequelize } = require("sequelize");

// 1. Lấy tất cả các bản ghi ExamQuestion (liên kết Exam-Question)
exports.getAllExamQuestions = async () => {
  try {
    const examQuestions = await ExamQuestion.findAll({
      include: [
        { model: Exam, as: "exam" }, // Giả sử alias 'exam' được định nghĩa
        { model: Question, as: "question" }, // Giả sử alias 'question' được định nghĩa
      ],
      order: [
        ["exam_id", "ASC"],
        ["question_order", "ASC"],
        ["question_id", "ASC"],
      ], // Sắp xếp theo exam, rồi thứ tự, rồi ID câu hỏi
    });
    return examQuestions;
  } catch (error) {
    console.error("Error fetching all exam-question links:", error);
    throw error;
  }
};

// 2. Lấy một bản ghi ExamQuestion cụ thể bằng ID của nó (exam_question_id)
exports.getExamQuestionById = async (examQuestionId) => {
  try {
    const examQuestion = await ExamQuestion.findByPk(examQuestionId, {
      include: [
        { model: Exam, as: "exam" },
        {
          model: Question,
          as: "question",
          include: [{ model: Answer, as: "answers" }], // Include câu trả lời vào câu hỏi
        },
      ],
    });
    // Trả về null nếu không tìm thấy, để controller xử lý 404
    return examQuestion;
  } catch (error) {
    console.error(
      `Error fetching exam-question link with ID ${examQuestionId}:`,
      error
    );
    throw error;
  }
};

// 3. Tạo một liên kết ExamQuestion mới
exports.createExamQuestion = async (data) => {
  // data nên chứa: exam_id, question_id, và có thể cả question_order
  const { exam_id, question_id, question_order } = data;

  if (exam_id === undefined || question_id === undefined) {
    throw new Error("Missing required fields: exam_id, question_id");
  }

  try {
    // Kiểm tra xem liên kết đã tồn tại chưa (tránh trùng lặp)
    const existingLink = await ExamQuestion.findOne({
      where: { exam_id: exam_id, question_id: question_id },
    });
    if (existingLink) {
      throw new Error(
        `Link between Exam ID ${exam_id} and Question ID ${question_id} already exists.`
      );
    }

    const newExamQuestion = await ExamQuestion.create({
      exam_id,
      question_id,
      question_order, // Sẽ là null nếu không được cung cấp
    });
    // Trả về bản ghi vừa tạo trực tiếp
    return newExamQuestion;
  } catch (error) {
    // Bắt lỗi khóa ngoại nếu exam_id hoặc question_id không tồn tại
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new Error(
        `Invalid Exam ID ${exam_id} or Question ID ${question_id}.`
      );
    }
    // Ném lại lỗi nếu là lỗi đã tồn tại hoặc lỗi khác
    if (error.message.includes("already exists")) {
      throw error;
    }
    console.error("Error creating exam-question link:", error);
    throw error; // Ném lỗi gốc hoặc lỗi đã xử lý
  }
};

// 4. Cập nhật thông tin của một ExamQuestion (chủ yếu là question_order)
exports.updateExamQuestion = async (examQuestionId, updateData) => {
  // updateData thường chỉ chứa { question_order: newValue }
  const { question_order } = updateData;

  // Cho phép cập nhật order thành null hoặc số nguyên
  if (
    question_order !== undefined &&
    question_order !== null &&
    (!Number.isInteger(question_order) || question_order < 0)
  ) {
    throw new Error(
      "Invalid value for question_order. It must be a non-negative integer or null."
    );
  }

  try {
    const examQuestion = await ExamQuestion.findByPk(examQuestionId);

    if (!examQuestion) {
      return null; // Trả về null nếu không tìm thấy
    }

    // Chỉ cập nhật question_order nếu nó được cung cấp trong updateData
    if (updateData.hasOwnProperty("question_order")) {
      await examQuestion.update({ question_order });
    } else {
      // Không có gì để cập nhật (hoặc có thể thêm logic cập nhật trường khác nếu cần)
      return examQuestion; // Trả về bản ghi gốc nếu không có gì thay đổi
    }

    // Trả về bản ghi đã cập nhật
    return examQuestion;
  } catch (error) {
    console.error(
      `Error updating exam-question link with ID ${examQuestionId}:`,
      error
    );
    throw error;
  }
};

// 5. Xóa một liên kết ExamQuestion bằng ID của nó
exports.deleteExamQuestion = async (examQuestionId) => {
  try {
    const examQuestion = await ExamQuestion.findByPk(examQuestionId);

    if (!examQuestion) {
      return { success: false, message: "Exam-Question link not found" };
    }

    await examQuestion.destroy();
    return {
      success: true,
      message: "Exam-Question link deleted successfully",
    };
  } catch (error) {
    console.error(
      `Error deleting exam-question link with ID ${examQuestionId}:`,
      error
    );
    throw error;
  }
};

// 6. Lấy tất cả các câu hỏi (và liên kết) cho một Exam cụ thể
// Trả về danh sách các bản ghi ExamQuestion, mỗi bản ghi kèm theo chi tiết Question (và Answers)
exports.getQuestionsForExam = async (examId) => {
  try {
    const examQuestions = await ExamQuestion.findAll({
      where: { exam_id: examId },
      include: [
        {
          model: Question,
          as: "question", // Alias từ quan hệ N-N
          include: [
            { model: Answer, as: "answers" }, // Include answers của question
            { model: require("./exam_category.model"), as: "category" }, // Include category của question
            {
              model: require("./difficulty_level.model"),
              as: "difficult_level",
            }, // Include difficulty của question
          ],
        },
        // Không cần include Exam vì examId đã biết
      ],
      order: [
        ["question_order", "ASC"],
        ["question_id", "ASC"],
      ], // Sắp xếp theo thứ tự rồi ID câu hỏi
    });
    return examQuestions;
  } catch (error) {
    console.error(`Error fetching questions for exam ${examId}:`, error);
    throw error;
  }
};

// 7. Lấy tất cả các bài thi sử dụng một Câu hỏi cụ thể
// Trả về danh sách các bản ghi ExamQuestion, mỗi bản ghi kèm theo chi tiết Exam
exports.getExamsForQuestion = async (questionId) => {
  try {
    const examLinks = await ExamQuestion.findAll({
      where: { question_id: questionId },
      include: [
        {
          model: Exam,
          as: "exam", // Alias từ quan hệ N-N
          include: [
            { model: require("./exam_category.model"), as: "category" },
          ], // Include category của exam
        },
        // Không cần include Question vì questionId đã biết
      ],
      order: [["exam_id", "ASC"]], // Sắp xếp theo ID bài thi
    });
    return examLinks;
  } catch (error) {
    console.error(`Error fetching exams for question ${questionId}:`, error);
    throw error;
  }
};

// --- Các hàm bổ sung có thể cần ---

// Thêm nhiều câu hỏi vào một bài thi cùng lúc
exports.addQuestionsToExam = async (examId, questionIds) => {
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error("questionIds must be a non-empty array.");
  }
  const transaction = await sequelize.transaction();
  try {
    const links = questionIds.map((question_id) => ({
      exam_id: examId,
      question_id,
    }));
    // Sử dụng bulkCreate để thêm hiệu quả, ignoreDuplicates để bỏ qua nếu liên kết đã tồn tại
    const createdLinks = await ExamQuestion.bulkCreate(links, {
      transaction,
      // ignoreDuplicates: true // Bỏ qua nếu cặp (exam_id, question_id) đã tồn tại - cần unique constraint trong DB
      // Hoặc updateOnDuplicate nếu muốn cập nhật (ví dụ: question_order) - phức tạp hơn
    });
    await transaction.commit();
    return createdLinks;
  } catch (error) {
    await transaction.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error(
        `One or more links between Exam ID ${examId} and provided Question IDs already exist.`
      );
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new Error(
        `Invalid Exam ID ${examId} or one or more invalid Question IDs.`
      );
    }
    console.error(`Error adding questions to exam ${examId}:`, error);
    throw error;
  }
};

// Xóa nhiều câu hỏi khỏi một bài thi cùng lúc
exports.removeQuestionsFromExam = async (examId, questionIds) => {
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error("questionIds must be a non-empty array.");
  }
  try {
    const result = await ExamQuestion.destroy({
      where: {
        exam_id: examId,
        question_id: {
          [Sequelize.Op.in]: questionIds,
        },
      },
    });
    // result là số lượng bản ghi đã bị xóa
    return { deletedCount: result };
  } catch (error) {
    console.error(`Error removing questions from exam ${examId}:`, error);
    throw error;
  }
};

// Cập nhật thứ tự câu hỏi cho một bài thi
exports.updateQuestionOrderForExam = async (examId, orderedQuestionIds) => {
  // orderedQuestionIds là một mảng các question_id theo thứ tự mong muốn
  if (!Array.isArray(orderedQuestionIds)) {
    throw new Error("orderedQuestionIds must be an array.");
  }
  const transaction = await sequelize.transaction();
  try {
    // Cập nhật thứ tự cho từng câu hỏi
    for (let i = 0; i < orderedQuestionIds.length; i++) {
      const question_id = orderedQuestionIds[i];
      const question_order = i + 1; // Thứ tự bắt đầu từ 1

      await ExamQuestion.update(
        { question_order: question_order },
        { where: { exam_id: examId, question_id: question_id }, transaction }
      );
    }
    // Xóa thứ tự cho các câu hỏi không có trong danh sách mới (nếu cần)
    // await ExamQuestion.update(
    //     { question_order: null },
    //     { where: { exam_id: examId, question_id: { [Sequelize.Op.notIn]: orderedQuestionIds } }, transaction }
    // );

    await transaction.commit();
    return { success: true, message: "Question order updated successfully." };
  } catch (error) {
    await transaction.rollback();
    console.error(`Error updating question order for exam ${examId}:`, error);
    throw error;
  }
};
