// src/services/exam_attempt.service.js
const ExamAttempt = require('../models/exam_attempt.model');
const UserAnswer = require('../models/user_answer.model');
const Exam = require('../models/exam.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const { Sequelize } = require('sequelize');

exports.startExamAttempt = async (userId, examId) => {
    try {
        // Kiểm tra user và exam có tồn tại không
        const user = await User.findByPk(userId);
        const exam = await Exam.findByPk(examId);

        if (!user) {
            throw new Error("User not found");
        }
        if (!exam) {
            throw new Error ("Exam not found");
        }

        // Kiểm tra xem user có đang làm bài thi khác không (tùy chọn)
        const existingAttempt = await ExamAttempt.findOne({
            where: {
                user_id: userId,
                exam_id: examId,
                end_time: null, // Kiểm tra xem có bài thi nào chưa kết thúc không
            },
        });

        if (existingAttempt) {
            throw new Error('User already has an active attempt for this exam');
        }

        // Tạo bản ghi ExamAttempt mới
        const newAttempt = await ExamAttempt.create({
            user_id: userId,
            exam_id: examId,
            start_time: new Date(), // Hoặc Sequelize.NOW nếu bạn muốn sử dụng thời gian của server DB
            end_time: null, // Ban đầu chưa kết thúc
            score: 0, // Ban đầu điểm là 0
            total_questions: 0, // Sẽ được cập nhật sau
            correct_answers: 0,
            incorrect_answers: 0,
        });

        // Lấy thông tin exam attempt (tùy chọn)
        const attempt = await ExamAttempt.findByPk(newAttempt.attempt_id, {
            include: [
                { model: Exam, as: 'exam' },
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
            ],
        });

        return attempt;
    } catch (error) {
        throw error;
    }
};

exports.submitAnswer = async (attemptId, questionId, selectedAnswer) => {
    try {
        // Kiểm tra xem attempt có tồn tại và thuộc về user không (quan trọng)
        const attempt = await ExamAttempt.findByPk(attemptId);
        if (!attempt) {
            throw new Error('Exam attempt not found');
        }

        // Kiểm tra xem attempt đã kết thúc chưa
        if (attempt.end_time !== null) {
            throw new Error('Exam attempt has already been submitted');
        }

        // Lấy thông tin câu hỏi
        const question = await Question.findByPk(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        // Kiểm tra đáp án đúng/sai
        const isCorrect = selectedAnswer === question.correct_answer;

        // Kiểm tra xem người dùng đã trả lời câu hỏi này chưa
        const existingAnswer = await UserAnswer.findOne({
            where: {
                attempt_id: attemptId,
                question_id: questionId,
            },
        });

        if (existingAnswer) {
            // Cập nhật câu trả lời nếu đã tồn tại
            await existingAnswer.update({
                selected_answer: selectedAnswer,
                is_correct: isCorrect,
            });
        } else {
            // Tạo bản ghi UserAnswer
            await UserAnswer.create({
                attempt_id: attemptId,
                question_id: questionId,
                selected_answer: selectedAnswer,
                is_correct: isCorrect,
            });
        }


        // Cập nhật thông tin attempt (số câu đúng/sai)
        if (isCorrect) {
            attempt.correct_answers += 1;
        } else {
            attempt.incorrect_answers += 1;
        }
        attempt.total_questions += 1; // Tăng tổng số câu hỏi đã trả lời
        await attempt.save();

        // Lấy thông tin UserAnswer với thông tin attempt và question (tùy chọn):
        const userAnswer = await UserAnswer.findOne({
            where: { attempt_id: attemptId, question_id: questionId },
            include: [
                { model: ExamAttempt, as: 'attempt' },
                { model: Question, as: 'question' },
            ],
        });
        return userAnswer; // Hoặc chỉ return { message: 'Answer submitted successfully' }
    } catch (error) {
        throw error;
    }
};

exports.endExamAttempt = async (attemptId) => {
    try {
        // Kiểm tra xem attempt có tồn tại không
        const attempt = await ExamAttempt.findByPk(attemptId);
        if (!attempt) {
            throw new Error('Exam attempt not found');
        }

        // Kiểm tra xem attempt đã kết thúc chưa
        if (attempt.end_time !== null) {
            throw new Error('Exam attempt has already been submitted');
        }
      
        // Tính điểm
        const totalQuestions = attempt.total_questions;
        const correctAnswers = attempt.correct_answers;
        const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0; // Tránh chia cho 0

        // Cập nhật thông tin attempt (thời gian kết thúc, điểm)
        await attempt.update({
            end_time: new Date(),
            score: score,
        });

        // Cập nhật bảng xếp hạng (gọi service leaderboard)
        const { updateLeaderboard } = require('./leaderboard.service'); // Tránh circular dependency
        await updateLeaderboard(attempt.user_id, score);

        return attempt;
    } catch (error) {
        throw error;
    }
};

exports.getAttemptDetails = async (attemptId) => {
    try {
        const attempt = await ExamAttempt.findByPk(attemptId, {
            include: [
                { model: Exam, as: 'exam' },
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                {
                    model: UserAnswer,
                    as: 'userAnswers', // Đổi tên alias thành 'userAnswers'
                    include: [{ model: Question, as: 'question' }], // Lấy thông tin câu hỏi
                },
            ],
        });
        if(!attempt) {
            throw new Error('Exam attempt not found');
        }
        return attempt;
    } catch (error) {
        throw error;
    }
}