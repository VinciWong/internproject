/* This is the code showing database*/
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

/* This is the login information of database*/
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* These are the queries for getting random name through searching */
/* First choose the theme, then choose subtheme, then choose categories */
/* Then the system will give you a name randomly */ 
router.get('/themes', async (req, res) => {
  const [rows] = await pool.query('SELECT DISTINCT theme FROM names');
  res.json(rows);
});

router.get('/subthemes', async (req, res) => {
  const [rows] = await pool.query('SELECT DISTINCT subtheme FROM names WHERE theme = ?', [req.query.theme]);
  res.json(rows);
});

router.get('/categories', async (req, res) => {
  const [rows] = await pool.query('SELECT DISTINCT category FROM names WHERE subtheme = ?', [req.query.subtheme]);
  res.json(rows);
});

router.get('/random', async (req, res) => {
  const [rows] = await pool.query('SELECT name FROM names WHERE category = ? ORDER BY RAND() LIMIT 1', [req.query.category]);
  res.json(rows[0] || { name: 'No name found' });
});

router.get('/all', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM names');
  res.json(rows);
});

router.post('/save', async (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'No data sent' });

  try {
    await pool.query('TRUNCATE TABLE names');
    for (const row of data) {
      const { name, theme, subtheme, category } = row;
      await pool.query(
        'INSERT INTO names (name, theme, subtheme, category) VALUES (?, ?, ?, ?)',
        [name || '', theme || '', subtheme || '', category || '']
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[Save Failed]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;
