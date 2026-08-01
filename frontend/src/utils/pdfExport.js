/**
 * PDF / Printable Report Generator Utility for LearnSphere AI
 * Generates formatted A4 PDF reports for both Students and Faculty Analytics.
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

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to download/print the PDF report.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${name}_Semester3_Report</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #0F172A;
          margin: 0;
          padding: 20px;
          background: #ffffff;
          font-size: 13px;
          line-height: 1.5;
        }
        .header-bar {
          border-bottom: 3px solid #701C34;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .institution-name {
          font-size: 18px;
          font-weight: 900;
          color: #701C34;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .doc-title {
          font-size: 14px;
          font-weight: 700;
          color: #475569;
          margin-top: 2px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .meta-item { font-size: 12px; }
        .meta-label { font-weight: 700; color: #475569; text-transform: uppercase; font-size: 10px; }
        .meta-val { font-weight: 800; color: #0F172A; font-size: 13px; }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }
        .badge-strong { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
        .badge-average { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
        .badge-weak { background: #FDF2F4; color: #701C34; border: 1px solid #FECDD3; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th, td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid #E2E8F0;
        }
        th {
          background: #701C34;
          color: #ffffff;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        tr:nth-child(even) { background: #F8FAFC; }
        .section-title {
          font-size: 14px;
          font-weight: 800;
          color: #701C34;
          border-bottom: 2px solid #E2E8F0;
          padding-bottom: 6px;
          margin-top: 20px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .recs-list {
          padding-left: 20px;
          margin: 0 0 30px 0;
        }
        .recs-list li {
          margin-bottom: 6px;
          font-weight: 600;
          color: #334155;
        }
        .footer-sig {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #E2E8F0;
          padding-top: 16px;
          font-size: 11px;
          color: #64748B;
        }
        .sig-box { text-align: center; width: 180px; }
        .sig-line { border-top: 1px solid #94A3B8; margin-top: 30px; padding-top: 4px; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="header-bar">
        <div>
          <div class="institution-name">${institution}</div>
          <div class="doc-title">${department}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 900; color: #701C34; font-size: 14px;">LearnSphere AI Engine</div>
          <div style="font-size: 10px; color: #64748B;">Date: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #0F172A; text-align: center; text-transform: uppercase;">
        Faculty Student Performance & Academic Intervention Report
      </h2>

      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Student Name</div>
          <div class="meta-val">${name}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Student Roll / Code</div>
          <div class="meta-val">${studentCode}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Academic Semester</div>
          <div class="meta-val">${semester}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Calculated Semester Readiness</div>
          <div class="meta-val" style="color: #701C34;">${readinessScore}% (${riskLevel})</div>
        </div>
      </div>

      <div class="section-title">Official Semester 3 Subject Marks Breakdown (Out of 50)</div>
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Subject Title</th>
            <th>IA Score</th>
            <th>Max Marks</th>
            <th>Percentage</th>
            <th>Performance Level</th>
          </tr>
        </thead>
        <tbody>
          ${subjects.map(s => `
            <tr>
              <td style="font-weight: 800; color: #701C34;">${s.code}</td>
              <td style="font-weight: 700;">${s.name}</td>
              <td style="font-weight: 800;">${s.score}</td>
              <td>${s.max || 50}</td>
              <td>${Math.round(((Number(s.score) || 0) / (s.max || 50)) * 100)}%</td>
              <td>
                <span class="badge ${
                  (Number(s.score) || 0) > 40 ? 'badge-strong' : (Number(s.score) || 0) >= 35 ? 'badge-average' : 'badge-weak'
                }">
                  ${(Number(s.score) || 0) > 40 ? 'Strong' : (Number(s.score) || 0) >= 35 ? 'Average' : 'Weak'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="section-title">AI-Generated Weaknesses & 6-Week Recovery Milestones</div>
      <ul class="recs-list">
        ${recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>

      <div class="footer-sig">
        <div>System Verified by LearnSphere AI Analytics</div>
        <div class="sig-box">
          <div class="sig-line">Academic Advisor Signature</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
