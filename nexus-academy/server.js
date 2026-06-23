require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
const { attachStudent } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy — required for Render/Railway/Heroku
app.set('trust proxy', 1);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'nexus-secret-2024',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Attach student to all views
app.use(attachStudent);

// Routes
app.use('/', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));
app.use('/learn', require('./routes/learn'));
app.use('/dashboard', require('./routes/dashboard'));

// HOME
app.get('/', async (req, res) => {
  try {
    const courses = await db.query('SELECT * FROM courses WHERE is_active = true ORDER BY price');
    res.render('index', { courses: courses.rows });
  } catch (err) {
    res.render('index', { courses: [] });
  }
});

// PayHero callback (global route)
app.post('/payment/callback', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    let data;
    try { data = JSON.parse(req.body); } catch { data = req.body; }
    console.log('Payment Callback received:', data);

    const reference = data.external_reference || data.ExternalReference;
    if (reference) {
      const isPaid =
        data.status === 'Success' ||
        data.status === 'SUCCESS' ||
        data.ResultCode === '0' ||
        data.result_code === '0' ||
        data.transaction_status === 'Success';

      await db.query(
        'UPDATE enrollments SET payment_status = $1, status = $2, enrolled_at = $3 WHERE payment_reference = $4',
        [isPaid ? 'paid' : 'failed', isPaid ? 'active' : 'pending', isPaid ? new Date() : null, reference]
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Callback error:', err);
    res.status(200).json({ received: true });
  }
});

// Keep alive ping — prevents Render free tier from sleeping
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const http = require('http');
    http.get(`http://localhost:${PORT}/`).on('error', () => {});
  }, 14 * 60 * 1000); // ping every 14 minutes
}

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

// Start
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════╗
║   🎓 NEXUS ACADEMY               ║
║   Running on http://localhost:${PORT}  ║
╚═══════════════════════════════════╝
  `);
});