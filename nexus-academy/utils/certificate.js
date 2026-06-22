const { v4: uuidv4 } = require('uuid');

// Generate unique certificate number
const generateCertNumber = (courseSlug, studentId) => {
  const prefix = {
    'web-development': 'NXWD',
    'graphic-design': 'NXGD',
    'cybersecurity': 'NXCS'
  }[courseSlug] || 'NXAC';
  
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${year}-${random}`;
};

// Generate certificate HTML (rendered server-side as a page)
const generateCertificateHTML = ({ studentName, courseName, certNumber, issuedDate }) => {
  const formattedDate = new Date(issuedDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate - ${certNumber}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a0f;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .cert-wrapper {
      width: 900px;
      max-width: 100%;
    }
    .cert {
      background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
      border: 2px solid #c9a84c;
      padding: 60px;
      position: relative;
      overflow: hidden;
    }
    .cert::before {
      content: '';
      position: absolute;
      top: 10px; right: 10px; bottom: 10px; left: 10px;
      border: 1px solid rgba(201,168,76,0.3);
      pointer-events: none;
    }
    .cert-corner {
      position: absolute;
      width: 60px; height: 60px;
      border-color: #c9a84c;
      border-style: solid;
    }
    .cert-corner.tl { top: 20px; left: 20px; border-width: 3px 0 0 3px; }
    .cert-corner.tr { top: 20px; right: 20px; border-width: 3px 3px 0 0; }
    .cert-corner.bl { bottom: 20px; left: 20px; border-width: 0 0 3px 3px; }
    .cert-corner.br { bottom: 20px; right: 20px; border-width: 0 3px 3px 0; }
    .cert-logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .cert-logo .logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      color: #c9a84c;
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    .cert-logo .logo-sub {
      font-size: 11px;
      color: rgba(201,168,76,0.6);
      letter-spacing: 6px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .divider {
      width: 200px;
      height: 1px;
      background: linear-gradient(to right, transparent, #c9a84c, transparent);
      margin: 20px auto;
    }
    .cert-title {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .cert-main-title {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      color: #fff;
      margin-bottom: 30px;
    }
    .cert-recipient-label {
      text-align: center;
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .cert-recipient {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      color: #c9a84c;
      font-style: italic;
      margin-bottom: 30px;
    }
    .cert-completion {
      text-align: center;
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      line-height: 1.8;
      max-width: 500px;
      margin: 0 auto 20px;
    }
    .cert-course {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: #fff;
      margin-bottom: 40px;
    }
    .cert-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
    }
    .cert-sig {
      text-align: center;
    }
    .sig-line {
      width: 160px;
      height: 1px;
      background: rgba(201,168,76,0.5);
      margin-bottom: 8px;
    }
    .sig-name {
      font-size: 12px;
      color: rgba(255,255,255,0.6);
    }
    .cert-seal {
      text-align: center;
    }
    .seal-circle {
      width: 80px;
      height: 80px;
      border: 2px solid #c9a84c;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    .seal-circle span {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      color: #c9a84c;
    }
    .cert-number {
      font-size: 10px;
      color: rgba(255,255,255,0.3);
      letter-spacing: 2px;
      margin-top: 4px;
    }
    .cert-date {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      margin-top: 4px;
    }
    @media print {
      body { background: white; }
      .no-print { display: none; }
    }
    .print-btn {
      display: block;
      margin: 20px auto;
      padding: 12px 30px;
      background: #c9a84c;
      color: #000;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="cert-wrapper">
    <div class="cert">
      <div class="cert-corner tl"></div>
      <div class="cert-corner tr"></div>
      <div class="cert-corner bl"></div>
      <div class="cert-corner br"></div>

      <div class="cert-logo">
        <div class="logo-text">Nexus Academy</div>
        <div class="logo-sub">Institute of Digital Excellence</div>
      </div>

      <div class="divider"></div>

      <div class="cert-title">Certificate of Completion</div>
      <div class="cert-main-title">This is to certify that</div>

      <div class="cert-recipient-label">The following individual</div>
      <div class="cert-recipient">${studentName}</div>

      <div class="cert-completion">
        has successfully completed all modules, passed all assessments, and demonstrated
        proficiency in the curriculum of
      </div>

      <div class="cert-course">${courseName}</div>

      <div class="divider"></div>

      <div class="cert-footer">
        <div class="cert-sig">
          <div class="sig-line"></div>
          <div class="sig-name">Academic Director</div>
          <div class="sig-name">Nexus Academy</div>
        </div>
        <div class="cert-seal">
          <div class="seal-circle"><span>NA</span></div>
          <div class="cert-number">${certNumber}</div>
          <div class="cert-date">${formattedDate}</div>
        </div>
        <div class="cert-sig">
          <div class="sig-line"></div>
          <div class="sig-name">Course Instructor</div>
          <div class="sig-name">Lead Faculty</div>
        </div>
      </div>
    </div>

    <button class="print-btn no-print" onclick="window.print()">🖨 Download / Print Certificate</button>
  </div>
</body>
</html>`;
};

module.exports = { generateCertNumber, generateCertificateHTML };
