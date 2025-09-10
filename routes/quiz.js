const express = require('express');
const Quiz = require('../models/quiz');
const { validateQuiz } = require('../schemas/quiz');

const router = express.Router();

router.post('/createQbanks', async (req, res) => {
  try {
    const validation = validateQuiz(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        errors: validation.errors.map(err => ({
          field: err.path ? err.path.join('.') : 'unknown',
          message: err.message
        }))
      });
    }

    const quizData = validation.data;
    const existingQuiz = await Quiz.findOne({ name: quizData.name });
    if (existingQuiz) {
      return res.status(409).json({
        error: 'Quiz with this name already exists'
      });
    }

    const quiz = new Quiz(quizData);
    const savedQuiz = await quiz.save();

    res.status(200).json({
      id: savedQuiz.id,
      name: savedQuiz.name,
      category: savedQuiz.category,
      noOfQuestions: savedQuiz.noOfQuestions,
      status: savedQuiz.status,
      createdAt: savedQuiz.createdAt
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/qbanks', async (_req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({
      error: 'Unable to fetch qbanks'
    });
  }
});

module.exports = router;
