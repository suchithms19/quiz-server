# Quiz Server API

A simple REST API for managing quiz question banks built with Node.js, Express, and MongoDB.

## Project Structure

```
src/
  config/
    db.js            # MongoDB connection configuration
  controllers/
    quiz.js          # HTTP handlers (validation, orchestration, responses)
  services/
    quiz.js          # Data access and domain operations
  models/
    quiz.js          # Mongoose schema and model definitions
  routes/
    quiz.js          # Express routes mapping to controllers
  schemas/
    quiz.js          # Zod validation schemas for request validation
  tests/
    controllers/
      quiz.test.js   # Controller layer unit tests
    services/
      quiz.test.js   # Service layer unit tests
  docs/
    quiz_collection.json  # Postman collection for API testing
index.js             # Main application entry point
Dockerfile           # Docker containerization configuration
```

## Features

- Create quiz question banks
- Retrieve all quiz banks
- Get specific quiz by ID
- Input validation using Zod
- MongoDB integration with Mongoose

## Setup

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

3. **Start the development server:**
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch
```

### Docker Deployment

1. **Build the Docker image:**
```bash
docker build -t quiz-server .
```

2. **Run the container:**
```bash
docker run -p 3000:3000 --env-file .env quiz-server
```

## API Endpoints

### Health Check
- **GET** `/ping` - Returns "pong" to check if server is running

### Quiz Management

#### Create Quiz Bank
- **POST** `/api/createQbanks`
- **Description**: Creates a new quiz question bank

**Request Body:**
```json
{
  "name": "JavaScript Basics",
  "category": "Programming",
  "noOfQuestions": 2,
  "status": true,
  "questions": [
    {
      "description": "What is JavaScript?",
      "options": [
        { "text": "A programming language", "isCorrect": true, "order": 0 },
        { "text": "A database", "isCorrect": false, "order": 1 },
        { "text": "A framework", "isCorrect": false, "order": 2 }
      ]
    },
    {
      "description": "Which keyword is used to declare variables?",
      "options": [
        { "text": "var", "isCorrect": true, "order": 0 },
        { "text": "int", "isCorrect": false, "order": 1 },
        { "text": "string", "isCorrect": false, "order": 2 }
      ]
    }
  ]
}
```

**Success Response (200):**
```json
{
  "id": "uuid-generated-id",
  "name": "JavaScript Basics",
  "category": "Programming",
  "noOfQuestions": 2,
  "status": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- **400** - Validation errors
- **409** - Quiz name already exists
- **500** - Internal server error

#### Get All Quiz Banks
- **GET** `/api/qbanks`
- **Description**: Retrieves all quiz banks (summary only)

**Success Response (200):**
```json
[
  {
    "id": "uuid-generated-id",
    "name": "JavaScript Basics",
    "category": "Programming",
    "noOfQuestions": 2,
    "status": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Quiz by ID
- **GET** `/api/qbanks/:id`
- **Description**: Retrieves a specific quiz bank with all questions

**Success Response (200):**
```json
{
  "id": "uuid-generated-id",
  "name": "JavaScript Basics",
  "category": "Programming",
  "noOfQuestions": 2,
  "status": true,
  "questions": [
    {
      "questionId": "uuid-generated-id",
      "description": "What is JavaScript?",
      "options": [
        { "text": "A programming language", "isCorrect": true, "order": 0 },
        { "text": "A database", "isCorrect": false, "order": 1 },
        { "text": "A framework", "isCorrect": false, "order": 2 }
      ]
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- **404** - Quiz not found
- **500** - Internal server error

#### Update Quiz Bank
- **PUT** `/api/qbanks/:id`
- **Description**: Updates an existing quiz bank

**Request Body:** (Same as create quiz bank)

**Success Response (200):**
```json
{
  "id": "uuid-generated-id",
  "name": "Updated JavaScript Basics",
  "category": "Programming",
  "noOfQuestions": 3,
  "status": true,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- **400** - Validation errors
- **404** - Quiz not found
- **500** - Internal server error

#### Get Analytics
- **GET** `/api/analytics`
- **Description**: Retrieves comprehensive analytics and statistics

**Success Response (200):**
```json
{
  "totals": {
    "totalQuizzes": 10,
    "activeQuizzes": 8,
    "totalQuestions": 45
  },
  "categoryBreakdown": [
    {
      "category": "Programming",
      "quizzes": 5,
      "activeQuizzes": 4,
      "totalQuestions": 25
    },
    {
      "category": "Mathematics",
      "quizzes": 3,
      "activeQuizzes": 2,
      "totalQuestions": 15
    }
  ],
  "statusBreakdown": [
    {
      "status": "Active",
      "count": 8
    },
    {
      "status": "Inactive",
      "count": 2
    }
  ]
}
```
