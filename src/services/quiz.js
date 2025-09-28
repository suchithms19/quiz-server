const Quiz = require('../models/quiz');

async function createQuiz(quizData) {
  const quiz = new Quiz(quizData);
  return quiz.save();
}

async function findQuizByName(name) {
  return Quiz.findOne({ name });
}

async function listQuizzes() {
  return Quiz.find({}, 'id name category noOfQuestions status createdAt').sort({ createdAt: -1 });
}

async function getQuizById(id) {
  return Quiz.findById(id);
}

module.exports = {
  createQuiz,
  findQuizByName,
  listQuizzes,
  getQuizById,
};


