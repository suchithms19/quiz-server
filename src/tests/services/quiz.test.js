const quizService = require('../../services/quiz');
const Quiz = require('../../models/quiz');

jest.mock('../../models/quiz');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

describe('Quiz Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new quiz successfully', async () => {
    const quizData = {
      name: 'JavaScript Basics',
      category: 'Programming',
      noOfQuestions: 2,
      status: true,
      questions: [
        {
          description: 'What is JavaScript?',
          options: [
            { text: 'Programming Language', isCorrect: true },
            { text: 'Database', isCorrect: false }
          ]
        },
        {
          description: 'Is JavaScript typed?',
          options: [
            { text: 'Yes', isCorrect: false },
            { text: 'No', isCorrect: true }
          ]
        }
      ]
    };

    const savedQuiz = {
      id: 'test-uuid-123',
      ...quizData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockSave = jest.fn().mockResolvedValue(savedQuiz);
    Quiz.mockImplementation(() => ({
      save: mockSave
    }));

    const result = await quizService.createQuiz(quizData);

    expect(Quiz).toHaveBeenCalledWith(quizData); 
    expect(mockSave).toHaveBeenCalled(); 
    expect(result).toEqual(savedQuiz);
  });


  test('should find quiz by name when it exists', async () => {
    const quizName = 'React Fundamentals';
    const foundQuiz = {
      id: 'test-uuid-456',
      name: quizName,
      category: 'Frontend',
      noOfQuestions: 3,
      status: true
    };

    Quiz.findOne.mockResolvedValue(foundQuiz);

    const result = await quizService.findQuizByName(quizName);

    expect(Quiz.findOne).toHaveBeenCalledWith({ name: quizName });
    expect(result).toEqual(foundQuiz);
  });


  test('should list all quizzes with selected fields', async () => {
    const mockQuizzes = [
      {
        id: 'quiz-1',
        name: 'HTML Basics',
        category: 'Web Development',
        noOfQuestions: 5,
        status: true
      },
      {
        id: 'quiz-2',
        name: 'CSS Styling',
        category: 'Web Development',
        noOfQuestions: 4,
        status: false
      }
    ];

    Quiz.find.mockResolvedValue(mockQuizzes);

    const result = await quizService.listQuizzes();

    expect(Quiz.find).toHaveBeenCalledWith({}, 'id name category noOfQuestions status');
    expect(result).toEqual(mockQuizzes);
    expect(result).toHaveLength(2); 
  });
});
