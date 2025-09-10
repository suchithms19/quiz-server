require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const quizRoutes = require('./routes/quiz');

const PORT = process.env.PORT || 3000;
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', quizRoutes);

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});