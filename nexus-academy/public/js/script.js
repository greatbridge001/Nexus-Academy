/* ===================================================
   NEXUS ACADEMY — script.js
   =================================================== */

// ── Navbar scroll effect ──────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ── Mobile menu toggle ────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ── Scroll reveal ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── FAQ accordion ─────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-q.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
    });

    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// ── Smooth scroll for anchor links ───────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Sidebar toggle for mobile (learn/lesson) ─────
const learnSidebar = document.getElementById('learnSidebar');
const lessonSidebar = document.getElementById('lessonSidebar');

function createSidebarToggle(sidebar, label) {
  if (!sidebar) return;
  const isMobile = window.innerWidth <= 900;
  if (!isMobile) return;

  const btn = document.createElement('button');
  btn.className = 'sidebar-toggle-btn';
  btn.innerHTML = `<i class="fas fa-list"></i> ${label || 'Course Menu'}`;
  btn.onclick = () => sidebar.classList.toggle('open');

  const main = sidebar.nextElementSibling;
  if (main) main.prepend(btn);
}

if (learnSidebar) createSidebarToggle(learnSidebar, 'Course Overview');
if (lessonSidebar) createSidebarToggle(lessonSidebar, 'Lesson List');

// ── Quiz option highlight ─────────────────────────
document.querySelectorAll('.qq-option').forEach(label => {
  label.addEventListener('click', () => {
    const group = label.closest('.qq-options');
    group.querySelectorAll('.qq-option').forEach(l => l.classList.remove('selected'));
    label.classList.add('selected');
    label.querySelector('input').checked = true;
    updateAnswerCount();
  });
});

function updateAnswerCount() {
  const total = document.querySelectorAll('.quiz-question').length;
  const answered = new Set(
    [...document.querySelectorAll('.qq-option input:checked')].map(i => i.name)
  ).size;
  const counter = document.getElementById('answeredCount');
  if (counter) counter.textContent = answered;

  const submitBtn = document.getElementById('submitQuizBtn');
  if (submitBtn) {
    if (answered === total) {
      submitBtn.classList.add('btn-primary');
      submitBtn.classList.remove('btn-ghost');
    }
  }
}

// ── Copy certificate number ───────────────────────
document.querySelectorAll('.cert-number-copy').forEach(el => {
  el.addEventListener('click', () => {
    navigator.clipboard.writeText(el.dataset.cert).then(() => {
      el.textContent = 'Copied!';
      setTimeout(() => el.textContent = 'Copy', 2000);
    });
  });
});

// ── Number counter animation ──────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent);
  if (isNaN(target)) return;
  const duration = 1500;
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ── Lesson sidebar active highlight ──────────────
const currentPath = window.location.pathname;
document.querySelectorAll('.ls-lesson-item').forEach(item => {
  if (item.getAttribute('href') === currentPath) {
    item.classList.add('active');
  }
});

// ── Form submit feedback ──────────────────────────
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function (e) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.noLoad) {
      setTimeout(() => {
        if (!btn.disabled) {
          btn.disabled = true;
          const orig = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
          btn.dataset.orig = orig;
        }
      }, 10);
    }
  });
});

// ── Progress bar animation on load ───────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.dash-prog-fill, .learn-progress-fill, .module-progress-fill, .sidebar-progress-fill').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1s cubic-bezier(0.4,0,0.2,1)';
      bar.style.width = target;
    }, 300);
  });
});

// ── Toast notification helper ─────────────────────
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    padding:14px 20px; border-radius:10px; font-size:14px;
    background:${type === 'success' ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)'};
    border:1px solid ${type === 'success' ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)'};
    color:${type === 'success' ? '#34d399' : '#f87171'};
    display:flex; align-items:center; gap:10px;
    animation:fadeUp 0.4s ease;
    backdrop-filter:blur(10px);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Mark lesson complete (global) ────────────────
window.markComplete = async function () {
  const btn = document.getElementById('completeBtn');
  if (!btn || btn.classList.contains('btn-done')) return;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  try {
    const res = await fetch(window.location.pathname + '/complete', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      btn.innerHTML = '<i class="fas fa-check"></i> Completed ✓';
      btn.classList.add('btn-done');
      btn.classList.remove('btn-complete');
      showToast('Lesson marked as complete!');
    } else {
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Mark Complete';
      btn.disabled = false;
    }
  } catch {
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Mark Complete';
    btn.disabled = false;
  }
};

console.log('%c NEXUS ACADEMY ', 'background:#c9a84c;color:#09090f;font-size:14px;font-weight:700;padding:6px 12px;border-radius:4px;');
