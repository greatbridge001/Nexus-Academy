const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { initiatePayment } = require('../utils/payhero');
const { v4: uuidv4 } = require('uuid');

// GET /courses - All courses listing
router.get('/', async (req, res) => {
  try {
    const courses = await db.query('SELECT * FROM courses WHERE is_active = true ORDER BY price');
    res.render('courses/index', { courses: courses.rows });
  } catch (err) {
    console.error(err);
    res.render('courses/index', { courses: [] });
  }
});

// GET /courses/:slug - Course detail page
router.get('/:slug', async (req, res) => {
  try {
    const courseResult = await db.query('SELECT * FROM courses WHERE slug = $1 AND is_active = true', [req.params.slug]);
    if (courseResult.rows.length === 0) return res.redirect('/courses');

    const course = courseResult.rows[0];
    const modules = await db.query(
      'SELECT * FROM modules WHERE course_id = $1 ORDER BY order_index',
      [course.id]
    );

    // Get lesson counts per module
    const lessonCounts = await db.query(
      `SELECT m.id, COUNT(l.id) as lesson_count
       FROM modules m LEFT JOIN lessons l ON l.module_id = m.id
       WHERE m.course_id = $1 GROUP BY m.id`,
      [course.id]
    );
    const countMap = {};
    lessonCounts.rows.forEach(r => countMap[r.id] = parseInt(r.lesson_count));

    // Check enrollment if logged in
    let enrollment = null;
    if (req.session.studentId) {
      const enrollResult = await db.query(
        'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
        [req.session.studentId, course.id]
      );
      enrollment = enrollResult.rows[0] || null;
    }

    res.render('courses/detail', {
      course,
      modules: modules.rows,
      countMap,
      enrollment,
      error: req.query.error || null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/courses');
  }
});

// POST /courses/:slug/enroll - Initiate enrollment + payment
router.post('/:slug/enroll', requireAuth, async (req, res) => {
  const { slug } = req.params;
  const { phone } = req.body;
  const studentId = req.session.studentId;

  try {
    const courseResult = await db.query('SELECT * FROM courses WHERE slug = $1', [slug]);
    if (courseResult.rows.length === 0) return res.redirect('/courses');
    const course = courseResult.rows[0];

    // Check existing enrollment
    const existing = await db.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, course.id]
    );

    if (existing.rows.length > 0 && existing.rows[0].payment_status === 'paid') {
      return res.redirect(`/learn/${slug}`);
    }

    const reference = `NX-${Date.now()}-${Math.floor(Math.random()*1000)}`;

    // Create or update enrollment
    let enrollmentId;
    if (existing.rows.length > 0) {
      enrollmentId = existing.rows[0].id;
      await db.query(
        'UPDATE enrollments SET payment_reference = $1, status = $2 WHERE id = $3',
        [reference, 'pending', enrollmentId]
      );
    } else {
      const newEnroll = await db.query(
        'INSERT INTO enrollments (student_id, course_id, payment_reference, amount_paid) VALUES ($1,$2,$3,$4) RETURNING id',
        [studentId, course.id, reference, course.price]
      );
      enrollmentId = newEnroll.rows[0].id;
    }

    // Initiate PayHero payment
    const payment = await initiatePayment({
      phone: phone,
      amount: course.price,
      reference: reference,
      description: `Nexus Academy - ${course.title}`
    });

    if (payment.success) {
      // Log payment
      await db.query(
        'INSERT INTO payment_logs (enrollment_id, phone, amount, checkout_id, status, response_data) VALUES ($1,$2,$3,$4,$5,$6)',
        [enrollmentId, phone, course.price, payment.data?.CheckoutRequestID, 'initiated', JSON.stringify(payment.data)]
      );

      if (payment.data?.CheckoutRequestID) {
        await db.query(
          'UPDATE enrollments SET payhero_checkout_id = $1 WHERE id = $2',
          [payment.data.CheckoutRequestID, enrollmentId]
        );
      }

      res.render('courses/payment-pending', {
        course,
        reference,
        phone,
        checkoutId: payment.data?.CheckoutRequestID
      });
    } else {
      res.render('courses/detail', {
        course,
        error: payment.error || 'Payment failed. Please try again.',
        modules: [],
        countMap: {},
        enrollment: null
      });
    }
  } catch (err) {
    console.error(err);
    res.redirect(`/courses/${slug}`);
  }
});

// GET /courses/:slug/check-payment
router.get('/:slug/check-payment', requireAuth, async (req, res) => {
  const { reference } = req.query;
  const studentId = req.session.studentId;
  try {
    const result = await db.query(
      `SELECT e.*, c.slug FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.payment_reference = $1 AND e.student_id = $2`,
      [reference, studentId]
    );
    if (result.rows.length === 0) return res.json({ status: 'not_found' });

    const enrollment = result.rows[0];
    res.json({
      status: enrollment.payment_status,
      courseSlug: enrollment.slug
    });
  } catch (err) {
    res.json({ status: 'error' });
  }
});

// POST /payment/callback - PayHero callback
router.post('/payment-callback', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    console.log('PayHero Callback:', data);

    const reference = data.external_reference || data.ExternalReference;
    const status = data.status || data.ResultCode;

    const enrollResult = await db.query(
      'SELECT * FROM enrollments WHERE payment_reference = $1',
      [reference]
    );

    if (enrollResult.rows.length > 0) {
      const enrollment = enrollResult.rows[0];
      const isPaid = status === '0' || status === 'SUCCESS' || data.ResultCode === '0';

      await db.query(
        'UPDATE enrollments SET payment_status = $1, status = $2, enrolled_at = $3 WHERE id = $4',
        [isPaid ? 'paid' : 'failed', isPaid ? 'active' : 'pending', isPaid ? new Date() : null, enrollment.id]
      );

      await db.query(
        'INSERT INTO payment_logs (enrollment_id, status, response_data) VALUES ($1,$2,$3)',
        [enrollment.id, isPaid ? 'paid' : 'failed', JSON.stringify(data)]
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Callback error:', err);
    res.status(200).json({ success: false });
  }
});

module.exports = router;
