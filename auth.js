/* This is the code for login portal*/
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { id, password } = req.body;
  if (id === 'apple' && password === 'apple') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
