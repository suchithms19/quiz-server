const { validateQuiz } = require('../schemas/quiz');
const quizService = require('../services/quiz');

async function createQbanks(req, res) {
  try {
    const validation = validateQuiz(req.body);
    if (!validation.success) {
      return res.status(400).json({
        errors: validation.errors.map((err) => ({
          field: err.path ? err.path.join('.') : 'unknown',
          message: err.message,
        })),
      });
    }

    const quizData = validation.data;
    const existing = await quizService.findQuizByName(quizData.name);
    if (existing) {
      return res.status(409).json({ error: 'Quiz with this name already exists' });
    }

    const saved = await quizService.createQuiz(quizData);
    return res.status(200).json({
      id: saved.id,
      name: saved.name,
      category: saved.category,
      noOfQuestions: saved.noOfQuestions,
      status: saved.status,
      createdAt: saved.createdAt,
    });
  } catch (_error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function listQbanks(_req, res) {
  try {
    const quizzes = await quizService.listQuizzes();
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return res.status(500).json({ error: 'Unable to fetch qbanks' });
  }
}

async function getQbankById(req, res) {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    return res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    return res.status(500).json({ error: 'Unable to fetch quiz' });
  }
}

module.exports = {
  createQbanks,
  listQbanks,
  getQbankById,
};


