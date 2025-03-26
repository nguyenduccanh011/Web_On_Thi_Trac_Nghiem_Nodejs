// src/services/user.service.js
const User = require('../models/user.model');
const ExamAttempt = require('../models/exam_attempt.model');
const Exam = require('../models/exam.model');
const Question = require('../models/question.model');
const UserAnswer = require('../models/user_answer.model');
const bcrypt = require('bcrypt');

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
    console.log('Fetching user with ID:', userId);
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Loại bỏ trường password
    });
    if (!user) {
      console.log('User not found with ID:', userId);
      return null;
    }
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw new Error('Lỗi khi lấy thông tin người dùng');
  }
};

exports.updateUser = async (userId, userData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Nếu có mật khẩu mới, hash nó
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Cập nhật thông tin user
    await user.update(userData);

    // Lấy lại thông tin user đã cập nhật (không bao gồm password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
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

exports.updateProfilePicture = async (userId, profilePicture) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Cập nhật ảnh đại diện
    await user.update({ profile_picture: profilePicture });

    // Lấy lại thông tin user đã cập nhật
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};