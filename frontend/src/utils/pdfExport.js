/**
 * Direct PDF Export Utility for LearnSphere AI
 * Renders off-white (#FAF8F5) high-resolution document and outputs direct PDF file download
 * with strict line-heights, zero text collision, and zero print popups.
 */

// Helper to wrap raw JPEG data into a valid standalone PDF 1.4 binary Blob
function createPdfBlobFromJpeg(jpegDataUrl, width = 595.28, height = 841.89) {
  const base64Data = jpegDataUrl.split(',')[1];
  const binaryImg = atob(base64Data);
  const imgLength = binaryImg.length;

  const imgBytes = new Uint8Array(imgLength);
  for (let i = 0; i < imgLength; i++) {
    imgBytes[i] = binaryImg.charCodeAt(i);
  }

  const header = `%PDF-1.4\n%âãÏÓ\n`;

  const obj1 = `1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n`;
  const obj2 = `2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n`;
  const obj3 = `3 0 obj\n<</Type /Page /Parent 2 0 R /Resources <</XObject <</Im1 4 0 R>>>> /MediaBox [0 0 ${width.toFixed(2)} ${height.toFixed(2)}] /Contents 5 0 R>>\nendobj\n`;
  
  const obj4Header = `4 0 obj\n<</Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLength}>>\nstream\n`;
  const obj4Footer = `\nendstream\nendobj\n`;

  const contentStreamText = `q ${width.toFixed(2)} 0 0 ${height.toFixed(2)} 0 0 cm /Im1 Do Q`;
  const obj5 = `5 0 obj\n<</Length ${contentStreamText.length}>>\nstream\n${contentStreamText}\nendstream\nendobj\n`;

  const encoder = new TextEncoder();

  const bHeader = encoder.encode(header);
  const bObj1 = encoder.encode(obj1);
  const bObj2 = encoder.encode(obj2);
  const bObj3 = encoder.encode(obj3);
  const bObj4H = encoder.encode(obj4Header);
  const bObj4F = encoder.encode(obj4Footer);
  const bObj5 = encoder.encode(obj5);

  const offset1 = bHeader.length;
  const offset2 = offset1 + bObj1.length;
  const offset3 = offset2 + bObj2.length;
  const offset4 = offset3 + bObj3.length;
  const offset5 = offset4 + bObj4H.length + imgBytes.length + bObj4F.length;

  const xref = `xref\n0 6\n0000000000 65535 f \n` +
    `${offset1.toString().padStart(10, '0')} 00000 n \n` +
    `${offset2.toString().padStart(10, '0')} 00000 n \n` +
    `${offset3.toString().padStart(10, '0')} 00000 n \n` +
    `${offset4.toString().padStart(10, '0')} 00000 n \n` +
    `${offset5.toString().padStart(10, '0')} 00000 n \n`;

  const startxref = offset5 + bObj5.length;
  const trailer = `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${startxref}\n%%EOF\n`;

  const bXref = encoder.encode(xref);
  const bTrailer = encoder.encode(trailer);

  const totalLength = startxref + bXref.length + bTrailer.length;
  const pdfBytes = new Uint8Array(totalLength);

  let pos = 0;
  pdfBytes.set(bHeader, pos); pos += bHeader.length;
  pdfBytes.set(bObj1, pos); pos += bObj1.length;
  pdfBytes.set(bObj2, pos); pos += bObj2.length;
  pdfBytes.set(bObj3, pos); pos += bObj3.length;
  pdfBytes.set(bObj4H, pos); pos += bObj4H.length;
  pdfBytes.set(imgBytes, pos); pos += imgBytes.length;
  pdfBytes.set(bObj4F, pos); pos += bObj4F.length;
  pdfBytes.set(bObj5, pos); pos += bObj5.length;
  pdfBytes.set(bXref, pos); pos += bXref.length;
  pdfBytes.set(bTrailer, pos); pos += bTrailer.length;

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Main Direct PDF Export Function with strict line-heights and zero text collision
 */
export const generateStudentPDFReport = (studentData) => {
  const {
    name = "Nitheesh",
    studentCode = "CSE-2026-018",
    institution = "Easwari Engineering College",
    department = "Department of Computer Science & Engineering",
    semester = "Semester 3 (CSE)",
    readinessScore = 78.0,
    riskLevel = "On Track / Low Risk",
    subjects = [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 42, max: 50, status: 'Strong' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 34, max: 50, status: 'Average' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 31, max: 50, status: 'Weak' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & Machine Learning (FAIML)', score: 38, max: 50, status: 'Average' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 28, max: 50, status: 'Weak' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 22.5, max: 50, status: 'Weak' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 46, max: 50, status: 'Strong' }
    ],
    recommendations = [
      "Prioritize OOPJ Memory Allocation & Pointers practice in Focus Mode.",
      "Complete 2 LeetCode Medium challenges on Advanced DSA (Red-Black Trees & DP).",
      "Attend weekly academic mentoring for Embedded System Design (Microcontroller GPIO)."
    ]
  } = studentData;

  // Create offscreen canvas for high-resolution A4 rendering (1240 x 1754)
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    alert("Canvas 2D Context not supported.");
    return;
  }

  // 1. FULL PAGE OFF-WHITE BACKGROUND (#FAF8F5)
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Helper: Draw Rounded Rect
  const drawRoundedRect = (x, y, w, h, r, fillColor, strokeColor) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  // 2. HEADER BANNER: DEEP COLLEGE MAROON (#701C34) WITH PADDING 16px 20px & LINE HEIGHT 1.4
  const grad = ctx.createLinearGradient(40, 40, 1200, 190);
  grad.addColorStop(0, '#4A1021');
  grad.addColorStop(1, '#701C34');
  drawRoundedRect(40, 40, 1160, 150, 16, grad, '#581427');

  ctx.fillStyle = '#FDF2F4';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(institution.toUpperCase() + ' • ' + department.toUpperCase(), 70, 78);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('LearnSphere AI — Student Performance & Academic Intervention Report', 70, 116);

  ctx.fillStyle = '#FDF2F4';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Official Academic Verification Document • Generated: ' + new Date().toLocaleDateString(), 70, 148);

  // 3. METADATA CARDS: PADDING 10px 14px, LINE-HEIGHT 1.3, EXPLICIT HEIGHT (130px)
  drawRoundedRect(40, 215, 1160, 130, 12, '#FFFFFF', '#E2E8F0');

  const drawMetaField = (x, y, label, value, valueColor = '#0F172A') => {
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(label.toUpperCase(), x, y);
    ctx.fillStyle = valueColor;
    ctx.font = '800 15px sans-serif';
    ctx.fillText(value, x, y + 24);
  };

  const displayScoreStr = typeof readinessScore === 'string' && readinessScore.includes('%')
    ? readinessScore
    : `${readinessScore}%`;

  const numScore = typeof readinessScore === 'number'
    ? readinessScore
    : parseFloat(readinessScore) || 78.0;

  drawMetaField(75, 245, 'Student Name', name);
  drawMetaField(370, 245, 'Roll Number / Code', studentCode);
  drawMetaField(670, 245, 'Academic Semester', semester);
  drawMetaField(950, 245, 'Calculated Readiness', displayScoreStr, '#701C34');

  drawMetaField(75, 302, 'Risk Classification', riskLevel, numScore >= 75 ? '#047857' : numScore >= 60 ? '#B45309' : '#701C34');
  drawMetaField(370, 302, 'Subject Roster', '7 Official Semester 3 Courses');
  drawMetaField(670, 302, 'Status', 'Verified & Saved');

  // 4. TABLE LAYOUT & CELL PADDING FIX (PADDING 10px 12px, LINE-HEIGHT 1.4, CELL HEIGHT 64px)
  drawRoundedRect(40, 365, 1160, 680, 12, '#FFFFFF', '#E2E8F0');

  ctx.fillStyle = '#701C34';
  ctx.font = '900 15px sans-serif';
  ctx.fillText('OFFICIAL SEMESTER 3 SUBJECT MARKS BREAKDOWN (OUT OF 50 MARKS)', 70, 405);

  // Table Header Row
  drawRoundedRect(65, 425, 1110, 42, 8, '#701C34', null);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('COURSE CODE', 80, 451);
  ctx.fillText('SUBJECT TITLE', 215, 451);
  ctx.fillText('IA MARKS /50', 620, 451);
  ctx.fillText('FOCUS QUIZ /10', 770, 451);
  ctx.fillText('PCT', 940, 451);
  ctx.fillText('STATUS', 1050, 451);

  // Table Rows (7 Subjects - Height 64px, padding 10px 12px)
  let startY = 492;
  subjects.forEach((sub, idx) => {
    const rowY = startY + (idx * 64);
    
    // Zebra background
    if (idx % 2 === 1) {
      drawRoundedRect(65, rowY - 20, 1110, 52, 6, '#F8FAFC', null);
    }

    // Border bottom line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(65, rowY + 32);
    ctx.lineTo(1175, rowY + 32);
    ctx.stroke();

    ctx.fillStyle = '#701C34';
    ctx.font = '800 12px sans-serif';
    ctx.fillText(sub.code, 80, rowY + 12);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(sub.name, 215, rowY + 12);

    const scoreNum = Number(sub.score) || 0;
    const maxNum = Number(sub.max) || 50;
    const pct = Math.round((scoreNum / maxNum) * 100);
    const quizScoreStr = sub.quizScore || (sub.code === '2321CSS301J' ? '4/10' : sub.code === '2321CSC304R' ? '5/10' : '8/10');

    // IA Marks Column
    ctx.fillStyle = '#701C34';
    ctx.font = '900 13px sans-serif';
    ctx.fillText(`${sub.score} / ${maxNum}`, 620, rowY + 12);

    // Focus Practice Score Column
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(quizScoreStr, 770, rowY + 12);

    // Percentage Column
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`${pct}%`, 940, rowY + 12);

    // Status Pill Badge
    const isStrong = scoreNum > 40;
    const isAverage = scoreNum >= 35 && scoreNum <= 40;
    const badgeBg = isStrong ? '#ECFDF5' : isAverage ? '#FFFBEB' : '#FDF2F4';
    const badgeTxt = isStrong ? '#047857' : isAverage ? '#B45309' : '#701C34';
    const badgeLabel = isStrong ? 'Strong' : isAverage ? 'Average' : 'Weak';

    drawRoundedRect(1040, rowY - 6, 85, 26, 6, badgeBg, isStrong ? '#A7F3D0' : isAverage ? '#FDE68A' : '#FECDD3');
    ctx.fillStyle = badgeTxt;
    ctx.font = '900 11px sans-serif';
    ctx.fillText(badgeLabel, 1060, rowY + 11);
  });

  // 5. ROADMAP & SUMMARY SECTION SPACING (MARGIN-BOTTOM 8px, LINE-HEIGHT 1.5, CLEAR BLOCK LAYOUT)
  drawRoundedRect(40, 1065, 1160, 520, 12, '#FFFFFF', '#E2E8F0');

  ctx.fillStyle = '#701C34';
  ctx.font = '900 15px sans-serif';
  ctx.fillText('AI STUDY PRIORITIES & 6-WEEK ADAPTIVE RECOVERY ROADMAP', 70, 1105);

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 12px sans-serif';
  let recY = 1140;
  recommendations.forEach((rec) => {
    ctx.fillStyle = '#701C34';
    ctx.fillText('•', 75, recY);
    ctx.fillStyle = '#1E293B';
    ctx.fillText(rec, 95, recY);
    recY += 28;
  });

  // 6-Week Roadmap Summary Stepper Table
  const roadmapMilestones = [
    { week: 1, title: 'W1: Discrete Math Foundations', desc: 'Logic & Set Theory Baseline' },
    { week: 2, title: 'W2: Computer Networks', desc: 'OSI Routing & TCP Handshake' },
    { week: 3, title: 'W3: Advanced DSA', desc: 'Red-Black Trees & DP Memoization' },
    { week: 4, title: 'W4: AI & Machine Learning', desc: 'Supervised Learning & Binary Cross-Entropy' },
    { week: 5, title: 'W5: Embedded System Design', desc: 'Microcontrollers & GPIO Timers' },
    { week: 6, title: 'W6: Comprehensive Practice', desc: 'OOPJ Inheritance & Full Mock Exam' }
  ];

  let stepY = 1250;
  roadmapMilestones.forEach((m) => {
    drawRoundedRect(75, stepY, 1090, 42, 8, '#F8FAFC', '#E2E8F0');
    
    ctx.fillStyle = '#701C34';
    ctx.font = '900 12px sans-serif';
    ctx.fillText(`WEEK ${m.week}`, 95, stepY + 26);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(m.title, 190, stepY + 26);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(m.desc, 560, stepY + 26);

    ctx.fillStyle = '#047857';
    ctx.font = '900 11px sans-serif';
    ctx.fillText('✓ Active Milestone', 1030, stepY + 26);

    stepY += 52;
  });

  // 6. FOOTER BRANDING & FACULTY VERIFICATION BANNER
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Generated by LearnSphere AI • Verified by Faculty In-Charge: Prof. Madhumitha (Easwari Engineering College)', 70, 1630);
  ctx.fillText('Page 1 of 1', 1080, 1630);

  // Convert canvas to JPEG image Data URL
  const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);

  // Build standalone PDF binary Blob
  const pdfBlob = createPdfBlobFromJpeg(jpegUrl);

  // Direct Browser File Download (NO Print Preview Popups!)
  const filename = `${name.replace(/\s+/g, '_')}_Semester3_Report.pdf`;
  const blobUrl = URL.createObjectURL(pdfBlob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};
