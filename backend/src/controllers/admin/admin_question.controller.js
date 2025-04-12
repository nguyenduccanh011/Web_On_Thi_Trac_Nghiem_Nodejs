const adminQuestionService = require('../../services/admin/admin_question.service');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await adminQuestionService.getAllQuestions();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
      const questionId = req.params.id;
      const question = await adminQuestionService.getQuestionById(questionId);
      res.status(200).json(question);
    } catch (error) {
      res.status(404).json({ message: error.message }); 
    }
}

exports.createQuestion = async(req, res) => {
    try {
        const questionData = req.body;
        const newQuestion = await adminQuestionService.createQuestion(questionData);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateQuestion = async (req, res) => {
    try {
      const questionId = req.params.id;
      const questionData = req.body;
      const updatedQuestion = await adminQuestionService.updateQuestion(questionId, questionData);
      res.status(200).json(updatedQuestion);
    } catch(error) {
      res.status(500).json({message: error.message});
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        await adminQuestionService.deleteQuestion(questionId);
        res.status(204).json({message: "Question deleted successfully"});
    } catch(error){
        res.status(500).json({message: error.message});
    }
}