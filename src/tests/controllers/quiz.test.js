const quizController = require('../../controllers/quiz');
const quizService = require('../../services/quiz');
const { validateQuiz } = require('../../schemas/quiz');

jest.mock('../../services/quiz');
jest.mock('../../schemas/quiz');

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-456')
}));

describe('Quiz Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      params: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  test('should create quiz successfully with valid data', async () => {
    const validQuizData = {
      name: 'Node.js Fundamentals',
      category: 'Backend',
      noOfQuestions: 1,
      status: true,
      questions: [
        {
          description: 'What is Node.js?',
          options: [
            { text: 'JavaScript Runtime', isCorrect: true },
            { text: 'Database', isCorrect: false }
          ]
        }
      ]
    };

    const savedQuiz = {
      id: 'test-uuid-789',
      ...validQuizData,
      createdAt: new Date()
    };

    mockReq.body = validQuizData;

    validateQuiz.mockReturnValue({
      success: true,
      data: validQuizData
    });

    quizService.findQuizByName.mockResolvedValue(null); 
    quizService.createQuiz.mockResolvedValue(savedQuiz);

    await quizController.createQbanks(mockReq, mockRes);

    expect(validateQuiz).toHaveBeenCalledWith(validQuizData);
    expect(quizService.findQuizByName).toHaveBeenCalledWith(validQuizData.name);
    expect(quizService.createQuiz).toHaveBeenCalledWith(validQuizData);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: savedQuiz.id,
      name: savedQuiz.name,
      category: savedQuiz.category,
      noOfQuestions: savedQuiz.noOfQuestions,
      status: savedQuiz.status,
      createdAt: savedQuiz.createdAt
    });
  });

  test('should return validation error for invalid data', async () => {
    const invalidQuizData = {
      name: '', 
      category: 'Test'
    };

    mockReq.body = invalidQuizData;

    validateQuiz.mockReturnValue({
      success: false,
      errors: [
        {
          path: ['name'],
          message: 'Quiz name is required'
        },
        {
          path: ['noOfQuestions'],
          message: 'Number of questions is required'
        }
      ]
    });

    await quizController.createQbanks(mockReq, mockRes);

    expect(validateQuiz).toHaveBeenCalledWith(invalidQuizData);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: [
        {
          field: 'name',
          message: 'Quiz name is required'
        },
        {
          field: 'noOfQuestions',
          message: 'Number of questions is required'
        }
      ]
    });
    
    expect(quizService.findQuizByName).not.toHaveBeenCalled();
    expect(quizService.createQuiz).not.toHaveBeenCalled();
  });
 
  test('should list all quizzes successfully', async () => {
    const mockQuizzes = [
      {
        id: 'quiz-1',
        name: 'Python Basics',
        category: 'Programming',
        noOfQuestions: 3,
        status: true
      },
      {
        id: 'quiz-2',
        name: 'Database Design',
        category: 'Database',
        noOfQuestions: 5,
        status: false
      }
    ];

    quizService.listQuizzes.mockResolvedValue(mockQuizzes);

    await quizController.listQbanks(mockReq, mockRes);

    expect(quizService.listQuizzes).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockQuizzes);
  });
});
