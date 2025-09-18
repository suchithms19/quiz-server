# Quiz Server API

A simple REST API for managing quiz question banks built with Node.js, Express, and MongoDB.

## Structure

```
src/
  controllers/
    quiz.js          # HTTP handlers (validation, orchestration, responses)
  services/
    quiz.js          # Data access and domain operations
  models/
    quiz.js          # Mongoose schema and model
  routes/
    quiz.js          # Express routes mapping to controllers
  schemas/
    quiz.js          # Zod validation schemas
  docs/
    quiz_collection.json  # Postman collection
```

## Features

- Create quiz question banks
- Retrieve all quiz banks
- Get specific quiz by ID
- Input validation using Zod
- MongoDB integration with Mongoose

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

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
        { "text": "A programming language", "isCorrect": true },
        { "text": "A database", "isCorrect": false },
        { "text": "A framework", "isCorrect": false }
      ]
    },
    {
      "description": "Which keyword is used to declare variables?",
      "options": [
        { "text": "var", "isCorrect": true },
        { "text": "int", "isCorrect": false },
        { "text": "string", "isCorrect": false }
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
    "status": true
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
        { "text": "A programming language", "isCorrect": true },
        { "text": "A database", "isCorrect": false },
        { "text": "A framework", "isCorrect": false }
      ]
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```
