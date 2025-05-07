/* This is the index code of backend*/
const express = require('express');
const cors = require('cors');
const app = express();
const namesRouter = require('./routes/names');
const uploadExcel = require("./upload")

app.use(cors());
app.use(express.json());

app.use('/api/names', require('./routes/names'));
app.use('/api/auth', require('./auth'));
app.use('/api/names', namesRouter);

uploadExcel()
  .then(() => {
    console.log('Excel upload successful.');
  })
  .catch((err) => {
    console.error('Excel upload failed:', err.message);
    // Don't exit the process, just log the error
  });

app.listen(3001, () => {
  console.log('Backend running at http://localhost:3001');
});



