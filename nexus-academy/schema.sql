-- NEXUS ACADEMY - DATABASE SCHEMA
-- Run this file in PostgreSQL to set up the database:
-- psql -U postgres -d nexus_academy -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  price INTEGER NOT NULL, -- in KES
  thumbnail_url TEXT,
  hero_image_url TEXT,
  level VARCHAR(50) DEFAULT 'Beginner',
  duration_hours INTEGER DEFAULT 40,
  total_modules INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT, -- Rich HTML content
  video_url TEXT, -- YouTube embed URL
  image_urls TEXT[], -- Array of image URLs
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  instructions TEXT,
  questions JSONB, -- Array of question objects
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, completed
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
  payment_reference VARCHAR(255),
  payhero_checkout_id TEXT,
  amount_paid INTEGER,
  enrolled_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Progress tracking
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  UNIQUE(student_id, lesson_id)
);

-- Exercise attempts
CREATE TABLE IF NOT EXISTS exercise_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  answers JSONB,
  score INTEGER,
  passed BOOLEAN DEFAULT false,
  attempted_at TIMESTAMP DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number VARCHAR(100) UNIQUE,
  issued_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Payment logs
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id),
  phone VARCHAR(20),
  amount INTEGER,
  checkout_id TEXT,
  status VARCHAR(50),
  response_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SEED DATA - Courses
-- =============================================

INSERT INTO courses (slug, title, subtitle, description, price, thumbnail_url, hero_image_url, level, duration_hours, total_modules) VALUES
(
  'web-development',
  'Full-Stack Web Development',
  'From Zero to Professional Developer',
  'Master modern web development from HTML basics to full-stack Node.js applications. Build real-world projects, learn industry best practices, and launch your career as a professional developer.',
  5000,
  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80',
  'Beginner to Advanced',
  80,
  8
),
(
  'graphic-design',
  'Professional Graphic Design',
  'Create Visuals That Command Attention',
  'Learn the art and science of graphic design. From color theory and typography to brand identity and digital illustration. Build a portfolio that opens doors.',
  3000,
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80',
  'Beginner to Intermediate',
  60,
  6
),
(
  'cybersecurity',
  'Cybersecurity & Ethical Hacking',
  'Defend Systems. Outsmart Threats.',
  'Become a cybersecurity professional. Learn penetration testing, network security, ethical hacking, and how to protect organizations from modern cyber threats.',
  10000,
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80',
  'Intermediate to Advanced',
  100,
  10
);

-- =============================================
-- WEB DEVELOPMENT MODULES
-- =============================================

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 1: Foundations of the Web', 'How the internet works, browsers, servers, and your first HTML page.', 1 FROM courses WHERE slug = 'web-development';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 2: HTML5 — Structure & Semantics', 'Master semantic HTML, forms, tables, multimedia, and accessibility.', 2 FROM courses WHERE slug = 'web-development';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 3: CSS3 — Design & Layout', 'Flexbox, Grid, animations, responsive design, and modern CSS techniques.', 3 FROM courses WHERE slug = 'web-development';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 4: JavaScript Fundamentals', 'Variables, functions, DOM manipulation, events, and ES6+ features.', 4 FROM courses WHERE slug = 'web-development';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 5: Advanced JavaScript & APIs', 'Async/await, fetch API, JSON, local storage, and third-party APIs.', 5 FROM courses WHERE slug = 'web-development';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 6: Node.js & Express Backend', 'Build servers, REST APIs, middleware, authentication, and file uploads.', 6 FROM courses WHERE slug = 'web-development';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 7: Databases with PostgreSQL', 'SQL fundamentals, schema design, queries, joins, and Node.js integration.', 7 FROM courses WHERE slug = 'web-development';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 8: Deployment & DevOps Basics', 'Git, GitHub, Vercel, Railway, VPS deployment, domains, and SSL.', 8 FROM courses WHERE slug = 'web-development';

-- =============================================
-- GRAPHIC DESIGN MODULES
-- =============================================

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 1: Design Principles & Theory', 'Balance, contrast, hierarchy, typography, and color theory foundations.', 1 FROM courses WHERE slug = 'graphic-design';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 2: Typography Mastery', 'Font pairing, type scales, readability, and typographic systems.', 2 FROM courses WHERE slug = 'graphic-design';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 3: Color Theory & Psychology', 'Color wheels, palettes, brand color systems, and emotional impact.', 3 FROM courses WHERE slug = 'graphic-design';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 4: Logo & Brand Identity Design', 'Logo creation process, brand guidelines, mockups, and deliverables.', 4 FROM courses WHERE slug = 'graphic-design';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 5: Digital Illustration', 'Vector graphics, icon design, illustration techniques with free tools.', 5 FROM courses WHERE slug = 'graphic-design';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 6: Portfolio & Freelancing', 'Building your portfolio, pitching clients, pricing, and contracts.', 6 FROM courses WHERE slug = 'graphic-design';

-- =============================================
-- CYBERSECURITY MODULES
-- =============================================

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 1: Cybersecurity Foundations', 'CIA triad, threat landscape, security frameworks, and career paths.', 1 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 2: Networking & Protocols', 'TCP/IP, DNS, HTTP/HTTPS, firewalls, VPNs, and network analysis.', 2 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 3: Linux for Security', 'Linux commands, file permissions, bash scripting, and system hardening.', 3 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 4: Cryptography Essentials', 'Encryption, hashing, PKI, TLS/SSL, and practical cryptography tools.', 4 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 5: Web Application Security', 'OWASP Top 10, SQL injection, XSS, CSRF, and secure coding.', 5 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 6: Ethical Hacking & Penetration Testing', 'Recon, scanning, exploitation, Metasploit, and responsible disclosure.', 6 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 7: Social Engineering & Phishing', 'Human hacking, phishing campaigns, vishing, and awareness training.', 7 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 8: Digital Forensics', 'Evidence collection, disk imaging, log analysis, and incident response.', 8 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 9: Cloud Security', 'AWS/GCP security, IAM, misconfiguration risks, and cloud pentesting.', 9 FROM courses WHERE slug = 'cybersecurity';

INSERT INTO modules (course_id, title, description, order_index)
SELECT id, 'Module 10: Security Operations & Certifications', 'SOC operations, SIEM tools, threat intelligence, and cert preparation.', 10 FROM courses WHERE slug = 'cybersecurity';
