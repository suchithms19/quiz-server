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


  test('should list all quizzes with selected fields sorted by createdAt descending', async () => {
    const mockQuizzes = [
      {
        id: 'quiz-2',
        name: 'CSS Styling',
        category: 'Web Development',
        noOfQuestions: 4,
        status: false,
        createdAt: new Date('2023-01-02T00:00:00.000Z')
      },
      {
        id: 'quiz-1',
        name: 'HTML Basics',
        category: 'Web Development',
        noOfQuestions: 5,
        status: true,
        createdAt: new Date('2023-01-01T00:00:00.000Z')
      }
    ];

    const mockSort = jest.fn().mockResolvedValue(mockQuizzes);
    Quiz.find.mockReturnValue({ sort: mockSort });

    const result = await quizService.listQuizzes();

    expect(Quiz.find).toHaveBeenCalledWith({}, 'id name category noOfQuestions status createdAt');
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockQuizzes);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('quiz-2');
    expect(result[1].id).toBe('quiz-1');
  });
});
