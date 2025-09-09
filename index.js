require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const PORT = process.env.PORT;
connectDB();

const app = express();

app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});