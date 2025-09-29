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

async function updateQuizById(id, quizData) {
  return Quiz.findByIdAndUpdate(
    id,
    { $set: quizData },
    { new: true }
  );
}

async function getAnalytics() {
  const [totals] = await Quiz.aggregate([
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        activeQuizzes: { $sum: { $cond: [{ $eq: ['$status', true] }, 1, 0] } },
        totalQuestions: { $sum: '$noOfQuestions' },
      },
    },
    { $project: { _id: 0 } },
  ]);

  const categoryBreakdown = await Quiz.aggregate([
    {
      $group: {
        _id: '$category',
        quizzes: { $sum: 1 },
        activeQuizzes: { $sum: { $cond: [{ $eq: ['$status', true] }, 1, 0] } },
        totalQuestions: { $sum: '$noOfQuestions' },
      },
    },
    { $sort: { quizzes: -1 } },
    {
      $project: {
        _id: 0,
        category: '$_id',
        quizzes: 1,
        activeQuizzes: 1,
        totalQuestions: 1,
      },
    },
  ]);
  
  const statusBreakdown = await Quiz.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: { $cond: [{ $eq: ['$_id', true] }, 'Active', 'Inactive'] },
        count: 1,
      },
    },
  ]);

  return {
    totals: totals || { totalQuizzes: 0, activeQuizzes: 0, totalQuestions: 0 },
    categoryBreakdown,
    statusBreakdown,
  };
}

module.exports = {
  createQuiz,
  findQuizByName,
  listQuizzes,
  getQuizById,
  updateQuizById,
  getAnalytics,
};


