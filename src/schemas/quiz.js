const { z } = require('zod');

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
  order: z.number().int().min(0, "Order must be non-negative").default(0)
});

const questionSchema = z.object({
  description: z.string().min(1, "Question description is required"),
  options: z.array(optionSchema)
    .min(1, "At least one option is required")
    .refine(
      (options) => options.some(option => option.isCorrect === true),
      { message: "At least one option must be correct" }
    )
});

const quizSchema = z.object({
  name: z.string().min(1, "Quiz name is required"),
  category: z.string().min(1, "Category is required"),
  noOfQuestions: z.number().int().positive("Number of questions must be positive"),
  status: z.boolean(),
  questions: z.array(questionSchema)
    .min(1, "At least one question is required")
}).refine(
  (data) => data.questions.length === data.noOfQuestions,
  { message: "Number of questions must match noOfQuestions field" }
);

const validateQuiz = (data) => {
  try {
    return {
      success: true,
      data: quizSchema.parse(data)
    };
  } catch (error) {
    return {
      success: false,
      errors: error.issues || error.errors || []
    };
  }
};

module.exports = {
  quizSchema,
  questionSchema,
  optionSchema,
  validateQuiz
};
