const Exam = require('../../models/exam.model');
const ExamQuestion = require('../../models/exam_question.model');
const Question = require('../../models/question.model');
const ExamCategory = require('../../models/exam_category.model');

exports.getAllExams = async () => {
    try {
        const exams = await Exam.findAll({
            include: [
                { model: ExamCategory, as: 'category' },
                { model: Question, as: 'questions', through: { attributes: [] } }
            ]
        });
        return exams;
    } catch (error) {
        throw error;
    }
};

exports.getExamById = async (examId) => {
    try {
        const exam = await Exam.findByPk(examId, {
            include: [
                { model: ExamCategory, as: 'category' },
                { model: Question, as: 'questions', through: { attributes: ['question_order'] } }
            ]
        });
        if (!exam) {
            throw new Error('Exam not found');
        }
        return exam;
    } catch (error) {
        throw error;
    }
};

exports.createExam = async (examData) => {
    try {
        const newExam = await Exam.create({
            exam_name: examData.exam_name,
            description: examData.description,
            category_id: examData.category_id
        });

        const questionIds = examData.questions;
        if (questionIds && questionIds.length > 0) {
            const examQuestions = questionIds.map((questionId, index) => ({
                exam_id: newExam.exam_id,
                question_id: questionId,
                question_order: index + 1
            }));
            await ExamQuestion.bulkCreate(examQuestions);
        }

        const examWithQuestions = await Exam.findByPk(newExam.exam_id, {
            include: [
                { model: ExamCategory, as: 'category' },
                { model: Question, as: 'questions', through: { attributes: ['question_order'] } }
            ]
        });
        return examWithQuestions;
    } catch (error) {
        throw error;
    }
};

exports.updateExam = async (examId, examData) => {
    try {
        const exam = await Exam.findByPk(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }

        await exam.update({
            exam_name: examData.exam_name,
            description: examData.description,
            category_id: examData.category_id
        });

        if (examData.questions && Array.isArray(examData.questions)) {
            await ExamQuestion.destroy({ where: { exam_id: examId } });

            const newExamQuestions = examData.questions.map((questionId, index) => ({
                exam_id: examId,
                question_id: questionId,
                question_order: index + 1
            }));
            await ExamQuestion.bulkCreate(newExamQuestions);
        }

        const updatedExam = await Exam.findByPk(examId, {
            include: [
                { model: ExamCategory, as: 'category' },
                { model: Question, as: 'questions', through: { attributes: ['question_order'] } }
            ]
        });
        return updatedExam;
    } catch (error) {
        throw error;
    }
};

exports.deleteExam = async (examId) => {
    try {
        const exam = await Exam.findByPk(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }

        await ExamQuestion.destroy({ where: { exam_id: examId } });
        await exam.destroy();
        return { message: 'Exam deleted successfully' };
    } catch (error) {
        throw error;
    }
};
