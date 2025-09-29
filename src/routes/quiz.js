const express = require('express');
const quizController = require('../controllers/quiz');

const router = express.Router();

router.post('/createQbanks', quizController.createQbanks);
router.get('/qbanks', quizController.listQbanks);
router.get('/qbanks/:id', quizController.getQbankById);
router.put('/qbanks/:id', quizController.updateQbank);

module.exports = router;
