const express = require('express');
const quiz_controller = require('../controllers/quiz');

const router = express.Router();

router.post('/createQbanks', quiz_controller.create_qbanks);
router.get('/qbanks', quiz_controller.list_qbanks);
router.get('/qbanks/:id', quiz_controller.get_qbank_by_id);

module.exports = router;
