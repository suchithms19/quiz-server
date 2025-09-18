const Quiz = require('../models/quiz');

async function create_quiz(quiz_data) {
  const quiz = new Quiz(quiz_data);
  return quiz.save();
}

async function find_quiz_by_name(name) {
  return Quiz.findOne({ name });
}

async function list_quizzes() {
  return Quiz.find({}, 'id name category noOfQuestions status');
}

async function get_quiz_by_id(id) {
  return Quiz.findById(id);
}

module.exports = {
  create_quiz,
  find_quiz_by_name,
  list_quizzes,
  get_quiz_by_id,
};


