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

exports.findExamByName = async (exam_name) => {
    try {
      if (!exam_name || exam_name.trim() === "") {
        throw new Error("exam_name is required for searching");
      }
  
      const exams = await Exam.findAll({
        where: {
          exam_name: {
            [Op.like]: `%${exam_name}%`
          }
        },
    
      });
  
      return exams;
    } catch (error) {
      console.error("Error in service - findExamByName:", error);
      throw error; // để controller xử lý
    }
  };
  