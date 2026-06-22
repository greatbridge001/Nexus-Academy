const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /dashboard
router.get('/', requireAuth, async (req, res) => {
  const studentId = req.session.studentId;
  try {
    const student = await db.query('SELECT * FROM students WHERE id = $1', [studentId]);

    // Get enrolled courses with progress
    const enrollments = await db.query(
      `SELECT e.*, c.title, c.slug, c.thumbnail_url, c.total_modules, c.price,
              c.level, c.duration_hours
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = $1
       ORDER BY e.created_at DESC`,
      [studentId]
    );

    // Get overall lesson progress per course
    const progressData = await db.query(
      `SELECT c.id as course_id,
              COUNT(l.id) as total_lessons,
              COUNT(lp.id) FILTER (WHERE lp.completed = true) as completed_lessons
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN modules m ON m.course_id = c.id
       JOIN lessons l ON l.module_id = m.id
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $1
       WHERE e.student_id = $1 AND e.payment_status = 'paid'
       GROUP BY c.id`,
      [studentId]
    );
    const progressMap = {};
    progressData.rows.forEach(p => {
      progressMap[p.course_id] = {
        total: parseInt(p.total_lessons),
        completed: parseInt(p.completed_lessons),
        percent: p.total_lessons > 0 ? Math.round((p.completed_lessons / p.total_lessons) * 100) : 0
      };
    });

    // Certificates
    const certs = await db.query(
      `SELECT cert.*, c.title, c.slug FROM certificates cert
       JOIN courses c ON c.id = cert.course_id
       WHERE cert.student_id = $1`,
      [studentId]
    );

    res.render('student/dashboard', {
      student: student.rows[0],
      enrollments: enrollments.rows,
      progressMap,
      certificates: certs.rows
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
