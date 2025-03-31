// src/services/exam_attempt.service.js
const ExamAttempt = require("../models/exam_attempt.model");
const UserAnswer = require("../models/user_answer.model"); // Model này cần được tạo và định nghĩa association
const Exam = require("../models/exam.model");
const User = require("../models/user.model"); // Cần thiết nếu muốn include User info vào Attempt/UserAnswer
const Question = require("../models/question.model");
const Answer = require("../models/answer.model");
const { Sequelize } = require("sequelize"); // Sequelize thường không cần import trực tiếp ở đây trừ khi dùng Op, literal, etc.

// Lưu kết quả bài thi (Phiên bản đã sửa)
exports.saveExamAttempt = async (userId, result) => {
  try {
    // Tạo đối tượng ExamAttempt từ dữ liệu đầu vào
    // Bỏ created_at, updated_at - Để Sequelize tự quản lý
    const attemptData = {
      user_id: userId,
      exam_id: result.exam_id,
      start_time: result.start_time,
      end_time: result.end_time,
      score: result.score,
      total_questions: result.total_questions,
      correct_answers: result.correct_answers,
      incorrect_answers: result.incorrect_answers,
      // Không cần created_at, updated_at ở đây nếu model dùng timestamps: true
    };

    // Kiểm tra các trường bắt buộc (tùy theo model)
    if (
      attemptData.exam_id === undefined ||
      attemptData.user_id === undefined
    ) {
      throw new Error(
        "Missing required data for saving exam attempt (exam_id, user_id)."
      );
    }

    // Lưu vào cơ sở dữ liệu
    const savedAttempt = await ExamAttempt.create(attemptData);
    return savedAttempt;
  } catch (error) {
    console.error("Error saving exam attempt:", error);
    // Bắt lỗi validation nếu có
    if (error.name === "SequelizeValidationError") {
      throw new Error(error.errors.map((e) => e.message).join(", "));
    }
    // Bắt lỗi khóa ngoại nếu user_id hoặc exam_id không hợp lệ
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new Error(
        `Invalid User ID (${userId}) or Exam ID (${result.exam_id}).`
      );
    }
    throw error; // Ném lại các lỗi khác
  }
};

// Lấy danh sách bài thi của một user
exports.getAttemptsByUser = async (userId) => {
  try {
    const attempts = await ExamAttempt.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Exam,
          as: "exam", // Đảm bảo alias này đúng với định nghĩa trong ExamAttempt.belongsTo
          attributes: ["exam_id", "exam_name"], // Lấy thêm ID để có thể link
        },
      ],
      order: [["start_time", "DESC"]], // Sắp xếp mới nhất lên đầu
    });
    return attempts;
  } catch (error) {
    console.error(`Error fetching attempts for user ${userId}:`, error);
    throw error;
  }
};

// Lấy thông tin cơ bản của một lượt làm bài theo ID
exports.getAttemptById = async (attemptId) => {
  try {
    const attempt = await ExamAttempt.findByPk(attemptId, {
      include: [
        {
          model: Exam,
          as: "exam", // Alias cho Exam
          include: [
            {
              model: require("../models/exam_category.model"),
              as: "category",
              attributes: ["category_name"],
            },
          ], // Include category của exam
        },
        {
          model: User, // Include thông tin user nếu cần
          as: "user", // Alias cho User
          attributes: ["user_id", "username", "email"], // Chọn lọc trường user
        },
      ],
    });
    if (!attempt) {
      // Không throw lỗi ở service, trả về null để controller xử lý 404
      return null;
      // throw new Error("Exam attempt not found");
    }
    return attempt;
  } catch (error) {
    console.error(`Error fetching attempt by ID ${attemptId}:`, error);
    throw error;
  }
};

// *** HÀM createExamAttempt ĐÃ BỊ LOẠI BỎ vì trùng lặp và lỗi ***

// Lấy thông tin chi tiết của một lượt làm bài (bao gồm câu trả lời, câu hỏi)
exports.getAttemptDetails = async (attemptId) => {
  /*
   * LƯU Ý QUAN TRỌNG: Hàm này yêu cầu các mối quan hệ sau phải được định nghĩa đúng trong các model:
   * 1. Trong `exam_attempt.model.js`: ExamAttempt.hasMany(UserAnswer, { foreignKey: 'attempt_id', as: 'user_answers' });
   * 2. Trong `user_answer.model.js`: UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });
   * 3. Trong `question.model.js`: Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' }); (Đã có)
   * 4. Trong `exam_attempt.model.js`: ExamAttempt.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' }); (Đã có)
   * 5. (Tùy chọn) Trong `user_answer.model.js`: UserAnswer.belongsTo(Answer, { foreignKey: 'selected_answer_id', as: 'selectedAnswer' }); // Nếu muốn lấy chi tiết câu đã chọn
   */
  try {
    const attempt = await ExamAttempt.findByPk(attemptId, {
      include: [
        {
          model: Exam,
          as: "exam", // Alias cho Exam
          attributes: ["exam_id", "exam_name"], // Lấy thông tin cần thiết của Exam
          include: [
            {
              model: require("../models/exam_category.model"),
              as: "category",
              attributes: ["category_name"],
            },
          ],
        },
        {
          model: UserAnswer, // Model lưu câu trả lời của user cho attempt này
          as: "user_answers", // Alias cho UserAnswer (cần định nghĩa trong ExamAttempt model)
          include: [
            {
              model: Question, // Include câu hỏi tương ứng
              as: "question", // Alias cho Question (cần định nghĩa trong UserAnswer model)
              attributes: {
                // Bỏ những trường không cần thiết cho việc review kết quả
                exclude: [
                  "category_id",
                  "difficult_level_id",
                  "created_at",
                  "updated_at",
                ],
              },
              include: [
                {
                  model: Answer, // Include tất cả các lựa chọn của câu hỏi này
                  as: "answers", // Alias cho Answer (cần định nghĩa trong Question model)
                  // Chỉ lấy các trường cần thiết để hiển thị và kiểm tra đáp án đúng
                  attributes: ["answer_id", "answer_text", "is_correct"],
                },
              ],
            },
            // { // Tùy chọn: Include chi tiết câu trả lời đã chọn (nếu có association)
            //   model: Answer,
            //   as: 'selectedAnswer', // Alias nếu có UserAnswer.belongsTo(Answer, {as: 'selectedAnswer'})
            //   attributes: ['answer_id', 'answer_text']
            // }
          ],
          // Chỉ lấy các trường cần thiết của UserAnswer
          attributes: [
            "user_answer_id",
            "question_id",
            "selected_answer_id",
            "is_correct",
          ],
        },
      ],
      order: [
        // Sắp xếp câu trả lời theo thứ tự câu hỏi (nếu có)
        // Giả sử UserAnswer có question_order hoặc dựa vào Question
        // [{ model: UserAnswer, as: 'user_answers' }, { model: Question, as: 'question' }, 'question_order', 'ASC']
        // Hoặc đơn giản là theo ID câu hỏi
        [{ model: UserAnswer, as: "user_answers" }, "question_id", "ASC"],
      ],
    });

    if (!attempt) {
      // Không throw lỗi ở service, trả về null để controller xử lý 404
      return null;
      // throw new Error("Exam attempt details not found");
    }
    return attempt; // Trả về đối tượng attempt lồng nhau rất chi tiết
  } catch (error) {
    console.error(`Error fetching attempt details for ID ${attemptId}:`, error);
    // Check lỗi association cụ thể nếu có thể
    if (error.message.includes("is not associated")) {
      console.error(
        "ASSOCIATION ERROR: Check model definitions for ExamAttempt, UserAnswer, Question, Answer."
      );
      throw new Error(`Configuration error: ${error.message}`); // Ném lỗi rõ ràng hơn
    }
    throw error;
  }
};
