const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { generateCertNumber, generateCertificateHTML } = require('../utils/certificate');

// Middleware: verify paid enrollment
const requirePaidEnrollment = async (req, res, next) => {
  try {
    const courseResult = await db.query('SELECT * FROM courses WHERE slug = $1', [req.params.slug]);
    if (!courseResult.rows.length) return res.redirect('/courses');
    req.course = courseResult.rows[0];

    const enrollment = await db.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2 AND payment_status = $3',
      [req.session.studentId, req.course.id, 'paid']
    );
    if (!enrollment.rows.length) return res.redirect(`/courses/${req.params.slug}?error=not_enrolled`);
    req.enrollment = enrollment.rows[0];
    next();
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

// GET /learn/:slug - Course overview + module list
router.get('/:slug', requireAuth, requirePaidEnrollment, async (req, res) => {
  const { course, enrollment } = req;
  try {
    const modules = await db.query(
      'SELECT * FROM modules WHERE course_id = $1 ORDER BY order_index',
      [course.id]
    );

    // Get progress per module
    const progress = await db.query(
      `SELECT l.module_id, COUNT(l.id) as total,
              COUNT(lp.id) FILTER (WHERE lp.completed = true) as completed
       FROM lessons l
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $1
       WHERE l.module_id IN (SELECT id FROM modules WHERE course_id = $2)
       GROUP BY l.module_id`,
      [req.session.studentId, course.id]
    );

    const progressMap = {};
    progress.rows.forEach(p => {
      progressMap[p.module_id] = {
        total: parseInt(p.total),
        completed: parseInt(p.completed),
        percent: p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0
      };
    });

    // Get exercise pass status per module
    const exPassed = await db.query(
      `SELECT e.module_id FROM exercises e
       JOIN exercise_attempts ea ON ea.exercise_id = e.id
       WHERE ea.student_id = $1 AND ea.passed = true AND e.module_id IN
       (SELECT id FROM modules WHERE course_id = $2)`,
      [req.session.studentId, course.id]
    );
    const passedModules = new Set(exPassed.rows.map(r => r.module_id));

    res.render('learn/overview', {
      course,
      modules: modules.rows,
      progressMap,
      passedModules
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// GET /learn/:slug/module/:moduleId/lesson/first — redirect to first lesson
router.get('/:slug/module/:moduleId/lesson/first', requireAuth, requirePaidEnrollment, async (req, res) => {
  try {
    const first = await db.query(
      'SELECT id FROM lessons WHERE module_id = $1 ORDER BY order_index LIMIT 1',
      [req.params.moduleId]
    );
    if (!first.rows.length) return res.redirect(`/learn/${req.params.slug}`);
    res.redirect(`/learn/${req.params.slug}/module/${req.params.moduleId}/lesson/${first.rows[0].id}`);
  } catch (err) {
    res.redirect(`/learn/${req.params.slug}`);
  }
});

// GET /learn/:slug/module/:moduleId/lesson/:lessonId
router.get('/:slug/module/:moduleId/lesson/:lessonId', requireAuth, requirePaidEnrollment, async (req, res) => {
  const { moduleId, lessonId } = req.params;
  try {
    const lesson = await db.query('SELECT * FROM lessons WHERE id = $1 AND module_id = $2', [lessonId, moduleId]);
    if (!lesson.rows.length) return res.redirect(`/learn/${req.params.slug}`);

    const module = await db.query('SELECT * FROM modules WHERE id = $1', [moduleId]);

    // All lessons in this module
    const allLessons = await db.query(
      'SELECT * FROM lessons WHERE module_id = $1 ORDER BY order_index',
      [moduleId]
    );

    // Mark lesson as in-progress (visited)
    await db.query(
      `INSERT INTO lesson_progress (student_id, lesson_id) VALUES ($1, $2)
       ON CONFLICT (student_id, lesson_id) DO NOTHING`,
      [req.session.studentId, lessonId]
    );

    // Find next/prev
    const lessonList = allLessons.rows;
    const currentIndex = lessonList.findIndex(l => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
    const nextLesson = currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;

    // Check completion
    const progress = await db.query(
      'SELECT completed FROM lesson_progress WHERE student_id = $1 AND lesson_id = $2',
      [req.session.studentId, lessonId]
    );

    res.render('learn/lesson', {
      course: req.course,
      module: module.rows[0],
      lesson: lesson.rows[0],
      allLessons: lessonList,
      prevLesson,
      nextLesson,
      isCompleted: progress.rows[0]?.completed || false
    });
  } catch (err) {
    console.error(err);
    res.redirect(`/learn/${req.params.slug}`);
  }
});

// POST /learn/:slug/module/:moduleId/lesson/:lessonId/complete
router.post('/:slug/module/:moduleId/lesson/:lessonId/complete', requireAuth, async (req, res) => {
  try {
    await db.query(
      `INSERT INTO lesson_progress (student_id, lesson_id, completed, completed_at)
       VALUES ($1, $2, true, NOW())
       ON CONFLICT (student_id, lesson_id) DO UPDATE SET completed = true, completed_at = NOW()`,
      [req.session.studentId, req.params.lessonId]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// GET /learn/:slug/module/:moduleId/exercise
router.get('/:slug/module/:moduleId/exercise', requireAuth, requirePaidEnrollment, async (req, res) => {
  try {
    const exercise = await db.query(
      'SELECT * FROM exercises WHERE module_id = $1',
      [req.params.moduleId]
    );
    if (!exercise.rows.length) {
      return res.redirect(`/learn/${req.params.slug}`);
    }
    const module = await db.query('SELECT * FROM modules WHERE id = $1', [req.params.moduleId]);

    // Previous attempts
    const attempts = await db.query(
      'SELECT * FROM exercise_attempts WHERE student_id = $1 AND exercise_id = $2 ORDER BY attempted_at DESC LIMIT 3',
      [req.session.studentId, exercise.rows[0].id]
    );

    res.render('learn/exercise', {
      course: req.course,
      module: module.rows[0],
      exercise: exercise.rows[0],
      attempts: attempts.rows,
      result: null
    });
  } catch (err) {
    console.error(err);
    res.redirect(`/learn/${req.params.slug}`);
  }
});

// POST /learn/:slug/module/:moduleId/exercise/submit
router.post('/:slug/module/:moduleId/exercise/submit', requireAuth, requirePaidEnrollment, async (req, res) => {
  try {
    const exercise = await db.query(
      'SELECT * FROM exercises WHERE module_id = $1', [req.params.moduleId]
    );
    const module = await db.query('SELECT * FROM modules WHERE id = $1', [req.params.moduleId]);

    if (!exercise.rows.length) return res.redirect(`/learn/${req.params.slug}`);

    const ex = exercise.rows[0];
    const questions = ex.questions;
    const answers = req.body;

    // Score the answers
    let correct = 0;
    const results = [];
    questions.forEach((q, i) => {
      const key = `q${i}`;
      const submitted = answers[key];
      const isCorrect = submitted === q.correct;
      if (isCorrect) correct++;
      results.push({ ...q, submitted, isCorrect });
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= (ex.passing_score || 70);

    await db.query(
      'INSERT INTO exercise_attempts (student_id, exercise_id, answers, score, passed) VALUES ($1,$2,$3,$4,$5)',
      [req.session.studentId, ex.id, JSON.stringify(answers), score, passed]
    );

    // Check for certificate eligibility
    let certEligible = false;
    if (passed) {
      certEligible = await checkCertificateEligibility(req.session.studentId, req.course.id);
      if (certEligible) {
        await issueCertificate(req.session.studentId, req.course.id, req.course.slug);
      }
    }

    const attempts = await db.query(
      'SELECT * FROM exercise_attempts WHERE student_id = $1 AND exercise_id = $2 ORDER BY attempted_at DESC LIMIT 3',
      [req.session.studentId, ex.id]
    );

    res.render('learn/exercise', {
      course: req.course,
      module: module.rows[0],
      exercise: ex,
      attempts: attempts.rows,
      result: { score, passed, correct, total: questions.length, results, certEligible }
    });
  } catch (err) {
    console.error(err);
    res.redirect(`/learn/${req.params.slug}`);
  }
});

// GET /learn/:slug/certificate
router.get('/:slug/certificate', requireAuth, requirePaidEnrollment, async (req, res) => {
  try {
    const student = await db.query('SELECT * FROM students WHERE id = $1', [req.session.studentId]);
    const cert = await db.query(
      'SELECT * FROM certificates WHERE student_id = $1 AND course_id = $2',
      [req.session.studentId, req.course.id]
    );

    if (!cert.rows.length) {
      return res.redirect(`/learn/${req.params.slug}?error=no_certificate`);
    }

    const html = generateCertificateHTML({
      studentName: student.rows[0].full_name,
      courseName: req.course.title,
      certNumber: cert.rows[0].certificate_number,
      issuedDate: cert.rows[0].issued_at
    });

    res.send(html);
  } catch (err) {
    console.error(err);
    res.redirect(`/learn/${req.params.slug}`);
  }
});

// Helper: check if all modules are passed
async function checkCertificateEligibility(studentId, courseId) {
  const result = await db.query(
    `SELECT COUNT(m.id) as total_modules,
            COUNT(ea.id) FILTER (WHERE ea.passed = true) as passed_modules
     FROM modules m
     LEFT JOIN exercises e ON e.module_id = m.id
     LEFT JOIN exercise_attempts ea ON ea.exercise_id = e.id AND ea.student_id = $1
     WHERE m.course_id = $2`,
    [studentId, courseId]
  );
  const row = result.rows[0];
  return row && row.total_modules > 0 && row.passed_modules >= row.total_modules;
}

// Helper: issue certificate
async function issueCertificate(studentId, courseId, courseSlug) {
  const existing = await db.query(
    'SELECT id FROM certificates WHERE student_id = $1 AND course_id = $2',
    [studentId, courseId]
  );
  if (existing.rows.length) return;
  const certNumber = generateCertNumber(courseSlug, studentId);
  await db.query(
    'INSERT INTO certificates (student_id, course_id, certificate_number) VALUES ($1,$2,$3)',
    [studentId, courseId, certNumber]
  );
  await db.query(
    'UPDATE enrollments SET status = $1, completed_at = NOW() WHERE student_id = $2 AND course_id = $3',
    ['completed', studentId, courseId]
  );
}

module.exports = router;
