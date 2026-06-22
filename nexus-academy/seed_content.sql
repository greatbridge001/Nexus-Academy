-- ===================================================
-- NEXUS ACADEMY — LESSON & EXERCISE SEED DATA
-- Run AFTER schema.sql:
-- psql -U postgres -d nexus_academy -f seed_content.sql
-- ===================================================

-- ============================================================
-- WEB DEVELOPMENT — Module 1 Lessons
-- ============================================================
INSERT INTO lessons (module_id, title, content, video_url, order_index, duration_minutes)
SELECT m.id,
  'How the Internet Works',
  '<h2>How the Internet Works</h2>
  <p class="lead">Before writing a single line of code, every developer needs to understand the infrastructure they are building for. The internet is not magic — it is a global network of computers talking to each other using agreed-upon rules called <strong>protocols</strong>.</p>
  <div class="content-block">
    <h3><i class="fas fa-network-wired"></i> The Client-Server Model</h3>
    <p>Every web interaction follows the same pattern: a <strong>client</strong> (your browser) makes a <strong>request</strong>, and a <strong>server</strong> sends back a <strong>response</strong>. When you type <code>google.com</code>, your browser asks a DNS server to translate that name into an IP address, then connects to Google''s servers to fetch the page.</p>
    <div class="lesson-images">
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&q=80" alt="Server room"></div>
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=700&q=80" alt="Network cables"></div>
    </div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-route"></i> Key Protocols You Must Know</h3>
    <p><strong>HTTP/HTTPS</strong> — HyperText Transfer Protocol. The language browsers and servers speak. HTTPS adds encryption using SSL/TLS.</p>
    <p><strong>DNS</strong> — Domain Name System. Like a phone book: translates <code>nexusacademy.co.ke</code> to an IP address.</p>
    <p><strong>TCP/IP</strong> — The foundational rules for transmitting data across networks, broken into small packets.</p>
    <div class="code-block"><pre><code>Browser                    Server
  |                           |
  |--- HTTP GET /index.html -->|
  |                           |
  |&lt;-- HTTP 200 OK ------------|
  |    (HTML content)          |</code></pre></div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-lightbulb"></i> Key Takeaway</h3>
    <div class="takeaway-box"><p>The web is a conversation. You (client) ask. The server answers. Everything you learn in web development is about crafting better questions and better answers in this conversation.</p></div>
  </div>',
  'https://www.youtube.com/embed/x3c1ih2NJEg',
  1, 20
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'web-development' AND m.order_index = 1;

INSERT INTO lessons (module_id, title, content, video_url, order_index, duration_minutes)
SELECT m.id,
  'Setting Up Your Developer Environment',
  '<h2>Setting Up Your Developer Environment</h2>
  <p class="lead">A craftsman is only as good as their tools. Let''s set up VS Code, install extensions, and prepare your machine to write professional code.</p>
  <div class="content-block">
    <h3><i class="fas fa-download"></i> Step 1: Install VS Code</h3>
    <p>Download Visual Studio Code from <strong>code.visualstudio.com</strong> — it is free, fast, and the most popular editor in the industry. Available for Windows, Mac, and Linux.</p>
    <div class="lesson-images">
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1607706189992-eae578626c86?w=700&q=80" alt="VS Code setup"></div>
    </div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-puzzle-piece"></i> Step 2: Essential Extensions</h3>
    <p>Install these extensions from the VS Code marketplace:</p>
    <div class="code-block"><pre><code>Prettier — Code Formatter
ESLint — JavaScript linting
Live Server — instant browser preview
Auto Rename Tag — sync HTML tags
GitLens — supercharged Git
Path Intellisense — file path autocomplete</code></pre></div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-terminal"></i> Step 3: Install Node.js</h3>
    <p>Go to <strong>nodejs.org</strong> and download the LTS version. Node.js lets you run JavaScript on your computer, outside the browser. Verify your install:</p>
    <div class="code-block"><pre><code>node --version
npm --version</code></pre></div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-lightbulb"></i> Key Takeaway</h3>
    <div class="takeaway-box"><p>Your dev environment is your cockpit. Spend time getting comfortable with VS Code shortcuts and extensions — they will save you hours every week.</p></div>
  </div>',
  'https://www.youtube.com/embed/EUJlVYggR1Y',
  2, 15
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'web-development' AND m.order_index = 1;

INSERT INTO lessons (module_id, title, content, video_url, order_index, duration_minutes)
SELECT m.id,
  'Your First HTML Page',
  '<h2>Your First HTML Page</h2>
  <p class="lead">HTML — HyperText Markup Language — is the skeleton of every webpage. It defines the structure and content. Let us write your very first webpage from scratch.</p>
  <div class="content-block">
    <h3><i class="fas fa-code"></i> The Boilerplate</h3>
    <p>Every HTML page starts with this structure. Type it out — do not copy-paste:</p>
    <div class="code-block"><pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;My First Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Hello, World!&lt;/h1&gt;
  &lt;p&gt;I built this. I am a developer.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre></div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-tags"></i> Understanding Tags</h3>
    <p>HTML uses <strong>tags</strong> to label content. Most tags come in pairs: an opening tag and a closing tag. The content sits between them.</p>
    <div class="lesson-images">
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=700&q=80" alt="HTML code on screen"></div>
    </div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-lightbulb"></i> Key Takeaway</h3>
    <div class="takeaway-box"><p>HTML is the language of content. Every element you see on a webpage — headings, paragraphs, images, buttons — starts as an HTML tag. Master the structure before the style.</p></div>
  </div>',
  'https://www.youtube.com/embed/qz0aGYrrlhU',
  3, 18
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'web-development' AND m.order_index = 1;

-- ============================================================
-- WEB DEVELOPMENT — Module 1 Exercise
-- ============================================================
INSERT INTO exercises (module_id, title, instructions, questions, passing_score)
SELECT m.id,
  'Module 1 Assessment: Web Foundations',
  'Test your understanding of how the internet works, developer tools, and HTML basics. You need 70% to pass.',
  '[
    {
      "question": "What does HTTP stand for?",
      "options": ["HyperText Transfer Protocol", "High Tech Text Processor", "Home Tool Transfer Program", "Hyper Transfer Text Process"],
      "correct": "HyperText Transfer Protocol",
      "explanation": "HTTP is the protocol that defines how web browsers and servers communicate."
    },
    {
      "question": "Which protocol adds encryption to HTTP?",
      "options": ["FTP", "HTTPS", "SSH", "TCP"],
      "correct": "HTTPS",
      "explanation": "HTTPS uses SSL/TLS to encrypt data between the browser and server."
    },
    {
      "question": "What is DNS used for?",
      "options": ["Designing websites", "Translating domain names to IP addresses", "Storing database records", "Compressing images"],
      "correct": "Translating domain names to IP addresses",
      "explanation": "DNS is like a phone book for the internet, mapping human-readable names to IP addresses."
    },
    {
      "question": "Which VS Code extension gives you instant browser preview?",
      "options": ["Prettier", "ESLint", "Live Server", "GitLens"],
      "correct": "Live Server",
      "explanation": "Live Server launches a local development server and auto-refreshes on file changes."
    },
    {
      "question": "What is the correct HTML boilerplate opening tag?",
      "options": ["html", "DOCTYPE html", "document", "webpage"],
      "correct": "DOCTYPE html",
      "explanation": "DOCTYPE html tells the browser this is an HTML5 document."
    },
    {
      "question": "In HTML, most tags come in which format?",
      "options": ["Single tags only", "Opening and closing pairs", "Numbered tags", "Attribute-only tags"],
      "correct": "Opening and closing pairs",
      "explanation": "Most HTML tags have an opening tag and closing tag with content between them."
    },
    {
      "question": "What does the head element contain?",
      "options": ["The visible page content", "Page title, meta tags, and CSS links", "Navigation menus", "Footer content"],
      "correct": "Page title, meta tags, and CSS links",
      "explanation": "The head contains metadata not displayed directly on the page."
    }
  ]'::jsonb,
  70
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'web-development' AND m.order_index = 1;

-- ============================================================
-- GRAPHIC DESIGN — Module 1 Lessons
-- ============================================================
INSERT INTO lessons (module_id, title, content, video_url, order_index, duration_minutes)
SELECT m.id,
  'The 5 Principles of Design',
  '<h2>The 5 Principles of Design</h2>
  <p class="lead">Design is not decoration. It is communication. These five principles are the invisible rules that separate professional work from amateur output.</p>
  <div class="content-block">
    <h3><i class="fas fa-balance-scale"></i> 1. Balance</h3>
    <p>Balance is the visual weight distribution on a page. <strong>Symmetrical balance</strong> feels formal and stable. <strong>Asymmetrical balance</strong> feels dynamic and modern. Neither is better — both must be intentional.</p>
    <div class="lesson-images">
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80" alt="Design balance"></div>
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=80" alt="Layout design"></div>
    </div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-layer-group"></i> 2. Hierarchy</h3>
    <p>Visual hierarchy guides the eye. The most important element should be the largest, boldest, or most colorful. Your reader''s eye moves from the headline to subheading to body to call to action. Design that order deliberately.</p>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-adjust"></i> 3. Contrast</h3>
    <p>Contrast creates interest and readability. Dark text on light background. Large heading beside small body text. Without contrast, everything blurs into sameness.</p>
    <div class="code-block"><pre><code>Good contrast:  Dark navy + Gold
Poor contrast:  Light gray + White</code></pre></div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-expand-arrows-alt"></i> 4. Alignment and 5. Repetition</h3>
    <p><strong>Alignment</strong> — Nothing should be placed arbitrarily. Every element should align to a grid or to another element. Invisible lines create invisible order.</p>
    <p><strong>Repetition</strong> — Repeat visual elements to create consistency. Same font for all headings. Same color for all links. Repetition creates brand recognition.</p>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-lightbulb"></i> Key Takeaway</h3>
    <div class="takeaway-box"><p>Before you open any design tool, ask yourself: What is the most important thing on this page? Where do I want the eye to go? The answers determine your hierarchy, contrast, and balance.</p></div>
  </div>',
  'https://www.youtube.com/embed/a5KYlHNKQB8',
  1, 22
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'graphic-design' AND m.order_index = 1;

-- ============================================================
-- GRAPHIC DESIGN — Module 1 Exercise
-- ============================================================
INSERT INTO exercises (module_id, title, instructions, questions, passing_score)
SELECT m.id,
  'Module 1 Assessment: Design Principles',
  'Test your understanding of the five core design principles. You need 70% to pass.',
  '[
    {
      "question": "Which design principle deals with how visual weight is distributed across a composition?",
      "options": ["Contrast", "Repetition", "Balance", "Alignment"],
      "correct": "Balance",
      "explanation": "Balance is about distributing visual weight — symmetrical for formal, asymmetrical for dynamic designs."
    },
    {
      "question": "What does visual hierarchy achieve?",
      "options": ["Makes all elements the same size", "Guides the viewers eye in order of importance", "Adds more colors to the design", "Creates texture"],
      "correct": "Guides the viewers eye in order of importance",
      "explanation": "Hierarchy uses size, weight, and color to direct attention from most to least important."
    },
    {
      "question": "Which color pair has good contrast?",
      "options": ["Light gray on white", "Dark navy on gold", "Green on teal", "Beige on cream"],
      "correct": "Dark navy on gold",
      "explanation": "High contrast combinations like dark navy on gold ensure readability and visual interest."
    },
    {
      "question": "What does alignment in design mean?",
      "options": ["Making all fonts the same", "Placing elements according to an invisible grid", "Using the same color everywhere", "Centering all text"],
      "correct": "Placing elements according to an invisible grid",
      "explanation": "Alignment means nothing is placed arbitrarily — all elements connect to an underlying structure."
    },
    {
      "question": "Why is repetition important in design?",
      "options": ["It makes designs more complex", "It creates consistency and brand recognition", "It fills empty space", "It reduces the need for hierarchy"],
      "correct": "It creates consistency and brand recognition",
      "explanation": "Repeating visual elements like colors, fonts, and shapes creates a cohesive, recognizable identity."
    }
  ]'::jsonb,
  70
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'graphic-design' AND m.order_index = 1;

-- ============================================================
-- CYBERSECURITY — Module 1 Lessons
-- ============================================================
INSERT INTO lessons (module_id, title, content, video_url, order_index, duration_minutes)
SELECT m.id,
  'The CIA Triad: Foundation of Cybersecurity',
  '<h2>The CIA Triad: Foundation of Cybersecurity</h2>
  <p class="lead">Every security decision you will ever make traces back to three properties: <strong>Confidentiality</strong>, <strong>Integrity</strong>, and <strong>Availability</strong>. This is the CIA Triad — the bedrock of the entire cybersecurity field.</p>
  <div class="content-block">
    <h3><i class="fas fa-eye-slash"></i> Confidentiality</h3>
    <p>Information should only be accessible to those authorized to see it. When you enter your bank PIN, that data should be confidential — only you and your bank should ever know it.</p>
    <p><strong>Threats to confidentiality:</strong> Eavesdropping, man-in-the-middle attacks, data breaches, social engineering.</p>
    <p><strong>Controls:</strong> Encryption, access control, multi-factor authentication.</p>
    <div class="lesson-images">
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&q=80" alt="Cybersecurity lock"></div>
      <div class="lesson-img-card"><img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80" alt="Network security"></div>
    </div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-shield-alt"></i> Integrity</h3>
    <p>Data should not be altered by unauthorized parties. If a hacker intercepts a money transfer and changes the amount, integrity is violated.</p>
    <p><strong>Threats to integrity:</strong> Data tampering, injection attacks, unauthorized modifications.</p>
    <p><strong>Controls:</strong> Hashing (SHA-256), digital signatures, checksums, audit logs.</p>
    <div class="code-block"><pre><code># Verify file integrity with SHA-256
sha256sum important_file.zip
# Compare with the hash provided by the sender</code></pre></div>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-server"></i> Availability</h3>
    <p>Systems and data must be accessible to authorized users when needed. A hospital whose patient records are encrypted by ransomware has an availability crisis that could cost lives.</p>
    <p><strong>Threats to availability:</strong> DDoS attacks, ransomware, hardware failure, power outages.</p>
    <p><strong>Controls:</strong> Redundancy, backups, failover systems, DDoS mitigation.</p>
  </div>
  <div class="content-block">
    <h3><i class="fas fa-lightbulb"></i> Key Takeaway</h3>
    <div class="takeaway-box"><p>The CIA Triad is your compass. Every attack violates at least one of these properties. Every security control protects at least one. Learn to identify which property is at risk in any scenario.</p></div>
  </div>',
  'https://www.youtube.com/embed/AJTJN4wDBM8',
  1, 25
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'cybersecurity' AND m.order_index = 1;

-- ============================================================
-- CYBERSECURITY — Module 1 Exercise
-- ============================================================
INSERT INTO exercises (module_id, title, instructions, questions, passing_score)
SELECT m.id,
  'Module 1 Assessment: Cybersecurity Foundations',
  'Test your understanding of the CIA Triad, threat landscape, and security fundamentals. 70% required to pass.',
  '[
    {
      "question": "What does the C in the CIA Triad stand for?",
      "options": ["Cryptography", "Confidentiality", "Control", "Cybersecurity"],
      "correct": "Confidentiality",
      "explanation": "Confidentiality ensures that information is only accessible to authorized individuals."
    },
    {
      "question": "A hacker intercepts a bank transfer and changes the amount. Which CIA property is violated?",
      "options": ["Confidentiality", "Availability", "Integrity", "All three"],
      "correct": "Integrity",
      "explanation": "Integrity ensures data is not altered by unauthorized parties. Changing the transfer amount violates integrity."
    },
    {
      "question": "A DDoS attack that takes down a hospital website primarily violates which CIA property?",
      "options": ["Confidentiality", "Integrity", "Availability", "Authentication"],
      "correct": "Availability",
      "explanation": "DDoS attacks overwhelm systems, making them unavailable to legitimate users."
    },
    {
      "question": "Which control helps ensure data Confidentiality?",
      "options": ["SHA-256 hashing", "Encryption", "System backups", "Audit logs"],
      "correct": "Encryption",
      "explanation": "Encryption converts data into an unreadable format, ensuring only authorized parties can access it."
    },
    {
      "question": "What is SHA-256 primarily used to verify?",
      "options": ["User passwords in plaintext", "Data Integrity via checksums", "Network availability", "Access control lists"],
      "correct": "Data Integrity via checksums",
      "explanation": "SHA-256 generates a unique hash of data. If data changes, the hash changes, revealing tampering."
    },
    {
      "question": "Multi-factor authentication (MFA) primarily protects which CIA property?",
      "options": ["Availability", "Integrity", "Confidentiality", "Scalability"],
      "correct": "Confidentiality",
      "explanation": "MFA adds layers to authentication, ensuring only authorized users can access confidential data."
    },
    {
      "question": "Ransomware that encrypts hospital files primarily violates which property?",
      "options": ["Only Confidentiality", "Only Integrity", "Availability and potentially Confidentiality", "None of the above"],
      "correct": "Availability and potentially Confidentiality",
      "explanation": "Ransomware makes files unavailable (Availability) and may also expose data (Confidentiality)."
    }
  ]'::jsonb,
  70
FROM modules m JOIN courses c ON c.id = m.course_id
WHERE c.slug = 'cybersecurity' AND m.order_index = 1;