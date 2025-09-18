const { validateQuiz } = require('../schemas/quiz');
const quiz_service = require('../services/quiz');

async function create_qbanks(req, res) {
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

    const quiz_data = validation.data;
    const existing = await quiz_service.find_quiz_by_name(quiz_data.name);
    if (existing) {
      return res.status(409).json({ error: 'Quiz with this name already exists' });
    }

    const saved = await quiz_service.create_quiz(quiz_data);
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

async function list_qbanks(_req, res) {
  try {
    const quizzes = await quiz_service.list_quizzes();
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return res.status(500).json({ error: 'Unable to fetch qbanks' });
  }
}

async function get_qbank_by_id(req, res) {
  try {
    const quiz = await quiz_service.get_quiz_by_id(req.params.id);
    return res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    return res.status(500).json({ error: 'Unable to fetch quiz' });
  }
}

module.exports = {
  create_qbanks,
  list_qbanks,
  get_qbank_by_id,
};


