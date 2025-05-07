const express = require('express');
const cors = require('cors');
const app = express();
const uploadExcel = require("./upload");
const namesRouter = require('./routes/names');
const authRouter = require('./auth');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/names', namesRouter);
app.use('/api/auth', authRouter);

// Upload Excel on server start
uploadExcel()
  .then(() => {
    console.log('Excel upload successful.');
  })
  .catch((err) => {
    console.error('Excel upload failed:', err.message);
  });

app.listen(3001, () => {
  console.log('Backend running at http://localhost:3001');
});
