const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// GET /register
router.get('/register', (req, res) => {
  if (req.session.studentId) return res.redirect('/dashboard');
  res.render('auth/register', { error: null, success: null });
});

// POST /register
router.post('/register', async (req, res) => {
  const { full_name, email, phone, password, confirm_password } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.render('auth/register', { error: 'All fields are required.', success: null });
  }
  if (password !== confirm_password) {
    return res.render('auth/register', { error: 'Passwords do not match.', success: null });
  }
  if (password.length < 8) {
    return res.render('auth/register', { error: 'Password must be at least 8 characters.', success: null });
  }

  try {
    const existing = await db.query('SELECT id FROM students WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.render('auth/register', { error: 'An account with this email already exists.', success: null });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      'INSERT INTO students (full_name, email, phone, password_hash) VALUES ($1,$2,$3,$4) RETURNING id',
      [full_name, email, phone, password_hash]
    );

    req.session.studentId = result.rows[0].id;
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Registration failed. Please try again.', success: null });
  }
});

// GET /login
router.get('/login', (req, res) => {
  if (req.session.studentId) return res.redirect('/dashboard');
  res.render('auth/login', { error: null, info: req.query.info || null });
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM students WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.render('auth/login', { error: 'Invalid email or password.', info: null });
    }
    const student = result.rows[0];
    const valid = await bcrypt.compare(password, student.password_hash);
    if (!valid) {
      return res.render('auth/login', { error: 'Invalid email or password.', info: null });
    }
    req.session.studentId = student.id;
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Login failed. Please try again.', info: null });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
