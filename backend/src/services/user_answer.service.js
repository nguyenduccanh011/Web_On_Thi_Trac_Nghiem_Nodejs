const UserAnswer = require("../models/user_answer.model"); // Import model UserAnswer

exports.saveUserAnswer = async (attempt_id, answers) => {
  try {
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const savedAnswers = await Promise.all(
      answers.map((answer) =>
        UserAnswer.create({
          attempt_id: attempt_id,
          question_id: answer.question_id,
          selected_answer: answer.selected_answer,
          is_correct: answer.is_correct,
          created_at: new Date(),
          updated_at: new Date(),
        })
      )
    );

    return savedAnswers;
  } catch (error) {
    throw error;
  }
};
