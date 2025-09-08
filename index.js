const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT;

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});