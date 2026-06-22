# 🎓 Nexus Academy — Premium E-Learning Platform

A full-stack university-grade e-learning platform built with Node.js, Express, EJS, PostgreSQL, and PayHero M-Pesa integration.

## ✨ Features

- **3 Premium Courses**: Web Development (KES 5,000), Graphic Design (KES 3,000), Cybersecurity (KES 10,000)
- **M-Pesa Payment** via PayHero STK Push
- **Modular Curriculum** with 24+ modules across 3 courses
- **Video-Embedded Lessons** — YouTube videos per lesson
- **Rich Illustrated Content** — images and detailed guides per lesson
- **Exercises After Every Module** — graded MCQ assessments with retry
- **Automatic Certificates** — issued when all modules are passed
- **Student Dashboard** — progress tracking, enrollments, certificates
- **Lifetime Access** — no subscription, pay once
- **PostgreSQL Database** — full relational schema
- **Responsive Design** — mobile-friendly premium UI

---

## 🗂 Project Structure

```
nexus-academy/
├── server.js               # Main Express app
├── schema.sql              # Database schema + course/module seed
├── seed_content.sql        # Lessons + exercise questions seed
├── .env.example            # Environment variables template
├── config/
│   └── db.js               # PostgreSQL connection pool
├── middleware/
│   └── auth.js             # Session auth + student attachment
├── routes/
│   ├── auth.js             # Register, login, logout
│   ├── courses.js          # Course listing, detail, enrollment, payment
│   ├── learn.js            # Lesson view, progress, exercises, certificates
│   └── dashboard.js        # Student dashboard
├── utils/
│   ├── payhero.js          # PayHero M-Pesa STK Push integration
│   └── certificate.js      # Certificate generation (HTML)
├── views/
│   ├── index.ejs           # Homepage
│   ├── 404.ejs             # 404 page
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── courses/
│   │   ├── index.ejs         # All courses
│   │   ├── detail.ejs        # Course detail + enroll
│   │   └── payment-pending.ejs
│   ├── learn/
│   │   ├── overview.ejs      # Course learning dashboard
│   │   ├── lesson.ejs        # Individual lesson
│   │   └── exercise.ejs      # Module exercise/quiz
│   └── student/
│       └── dashboard.ejs
└── public/
    ├── css/styles.css
    └── js/script.js
```

---

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js v18+ (`node --version`)
- PostgreSQL 14+ installed and running
- A PayHero account with API credentials

### 2. Clone & Install

```bash
cd nexus-academy
npm install
```

### 3. Create PostgreSQL Database

```bash
# In psql or via pgAdmin:
CREATE DATABASE nexus_academy;

# Run the schema (creates tables + seeds courses/modules):
psql -U postgres -d nexus_academy -f schema.sql

# Run lesson content seed:
psql -U postgres -d nexus_academy -f seed_content.sql
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/nexus_academy

SESSION_SECRET=change-this-to-a-long-random-string

# Get from https://payhero.co.ke
PAYHERO_API_KEY=your_api_username:your_api_password
PAYHERO_CHANNEL_ID=your_channel_id

APP_URL=http://localhost:3000
NODE_ENV=development
```

> **PayHero API Key format**: `username:password` (the system Base64 encodes it automatically)

### 5. Run the App

```bash
# Development (with auto-restart):
npm run dev

# Production:
npm start
```

Open **http://localhost:3000**

---

## 📦 Deployment (Railway / Render)

### Option A: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway init
railway add postgresql
railway up
```

Set environment variables in Railway dashboard.

### Option B: Render

1. Push to GitHub
2. Create a new Web Service on render.com
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables
6. Create a PostgreSQL database on Render and connect

### Option C: Truehost VPS (Ubuntu)

```bash
# On your VPS:
sudo apt update && sudo apt install nodejs npm postgresql nginx -y

# Clone your project, install dependencies
npm install --production

# Install PM2
npm install -g pm2
pm2 start server.js --name nexus-academy
pm2 save && pm2 startup

# Nginx config (/etc/nginx/sites-available/nexus)
server {
    listen 80;
    server_name yourdomain.co.ke;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# SSL with Certbot
sudo certbot --nginx -d yourdomain.co.ke
```

---

## 💳 PayHero Integration

1. Sign up at **payhero.co.ke**
2. Create a channel (M-Pesa STK Push)
3. Get your API credentials and Channel ID
4. Set `PAYHERO_API_KEY=username:password` in `.env`
5. Set `PAYHERO_CHANNEL_ID=your_id` in `.env`
6. Set `APP_URL` to your live domain for the callback URL

Callbacks are received at: `POST /payment/callback`

---

## 📝 Adding Lesson Content

Lessons are stored as HTML in the `content` column of the `lessons` table. 

**Via SQL:**
```sql
UPDATE lessons
SET content = '<h2>Your Title</h2><p>Your content...</p>',
    video_url = 'https://www.youtube.com/embed/VIDEO_ID'
WHERE id = 'lesson-uuid';
```

**Adding more exercises:**
```sql
INSERT INTO exercises (module_id, title, instructions, questions, passing_score)
VALUES (
  'module-uuid',
  'Module Title Assessment',
  'Instructions here',
  '[{"question":"Q?","options":["A","B","C","D"],"correct":"A","explanation":"Why A"}]',
  70
);
```

---

## 🎨 Courses & Pricing

| Course | Price | Modules | Duration |
|--------|-------|---------|----------|
| Web Development | KES 5,000 | 8 | 80 hours |
| Graphic Design | KES 3,000 | 6 | 60 hours |
| Cybersecurity | KES 10,000 | 10 | 100 hours |

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- Sessions are server-side with secure cookies in production
- All course content routes check paid enrollment status
- SQL queries use parameterized statements (no injection risk)

---

## 📞 Support

Built by **Nexus Academy** — *Institute of Digital Excellence*
