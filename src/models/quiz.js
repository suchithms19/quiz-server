const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    default: () => uuidv4()
  },
  description: {
    type: String,
    required: true
  },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: function(options) {
        return options.length >= 1 && options.some(option => option.isCorrect === true);
      },
      message: 'At least one option must be correct'
    }
  }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  noOfQuestions: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function(questions) {
        return questions.length >= 1 && questions.length === this.noOfQuestions;
      },
      message: 'Number of questions must match noOfQuestions field'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
