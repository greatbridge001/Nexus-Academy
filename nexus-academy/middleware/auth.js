// Require student to be logged in
const requireAuth = (req, res, next) => {
  if (!req.session.studentId) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

// Require active enrollment for a course
const requireEnrollment = (courseSlug) => async (req, res, next) => {
  const db = require('../config/db');
  try {
    const result = await db.query(
      `SELECT e.status FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = $1 AND c.slug = $2 AND e.payment_status = 'paid'`,
      [req.session.studentId, courseSlug]
    );
    if (result.rows.length === 0) {
      return res.redirect(`/courses/${courseSlug}?error=not_enrolled`);
    }
    next();
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

// Attach student to res.locals for all views
const attachStudent = async (req, res, next) => {
  if (req.session.studentId) {
    const db = require('../config/db');
    try {
      const result = await db.query(
        'SELECT id, full_name, email, phone FROM students WHERE id = $1',
        [req.session.studentId]
      );
      res.locals.student = result.rows[0] || null;
    } catch {
      res.locals.student = null;
    }
  } else {
    res.locals.student = null;
  }
  next();
};

module.exports = { requireAuth, requireEnrollment, attachStudent };
