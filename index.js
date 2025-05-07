import express from 'express';
import cors from 'cors';
import namesRouter from './routes/names.js';
import authRouter from './auth.js';
import uploadExcel from './upload.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/names', namesRouter);
app.use('/api/auth', authRouter);

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
