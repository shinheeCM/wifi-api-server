// server.js

const express = require('express');
const app = express();
const port = 3000;

// Basic GET API that responds with status 200
app.get('/status', (req, res) => {
  res.status(200).send('Server is running');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
