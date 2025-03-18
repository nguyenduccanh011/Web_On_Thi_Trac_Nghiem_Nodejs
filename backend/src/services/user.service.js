// src/services/user.service.js
const User = require('../models/user.model');
const ExamAttempt = require('../models/exam_attempt.model');
const Exam = require('../models/exam.model');
const Question = require('../models/question.model');
const UserAnswer = require('../models/user_answer.model');

exports.getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Loại bỏ trường password
    });
    return users;
  } catch (error) {
    throw error;
  }
};

exports.getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Loại bỏ trường password
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (userId, userData) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Cập nhật thông tin người dùng (không cập nhật mật khẩu ở đây)
        await user.update({
            full_name: userData.full_name || user.full_name, // Nếu không có giá trị mới thì giữ nguyên
            email: userData.email || user.email,
            profile_picture: userData.profile_picture || user.profile_picture,
            role: userData.role || user.role, // Có thể cập nhật role, cần kiểm tra quyền trước khi cho phép
        });
          // Lấy lại thông tin user sau khi update
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
        });

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

exports.deleteUser = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Xóa các bản ghi liên quan (exam attempts, user answers, ...) nếu cần
        await ExamAttempt.destroy({ where: { user_id: userId } }); // Ví dụ
        // Xóa user
        await user.destroy();
        return {message: 'User deleted successfully'}
    } catch (error) {
        throw error;
    }
};

exports.getUserExamHistory = async (userId) => {
    try {
        const examAttempts = await ExamAttempt.findAll({
            where: { user_id: userId },
            include: [
                { model: Exam, as: 'exam' }, // Lấy thông tin đề thi
                {
                    model: UserAnswer,
                    as: 'userAnswers', // Đổi tên alias thành 'userAnswers'
                    include: [{ model: Question, as: 'question' }], // Lấy thông tin câu hỏi
                },
            ],
        });
        return examAttempts;
    } catch (error) {
        throw error;
    }
};