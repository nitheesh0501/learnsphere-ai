/**
 * Unified Readiness Calculator Utility for LearnSphere AI
 * Calculates exact overall readiness percentage across 7 Semester 3 subjects.
 * Shared between Student Hub, App.jsx, and Faculty Analytics.
 */

export function calculateReadiness(subjects) {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return 51;
  }

  // Check if any mark is invalid (> 50 or < 0)
  const hasInvalid = subjects.some((sub) => {
    const val = sub.internalMarks !== undefined ? sub.internalMarks : (sub.score !== undefined ? sub.score : null);
    if (val === '' || val === null || val === undefined) return false;
    const num = Number(val);
    const max = Number(sub.maxMarks || sub.max || 50);
    return isNaN(num) || num < 0 || num > max;
  });

  if (hasInvalid) {
    return null; // Return null on invalid input
  }

  const validMarks = subjects.map((sub) => {
    const val = sub.internalMarks !== undefined ? sub.internalMarks : (sub.score !== undefined ? sub.score : null);
    if (val === '' || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  });

  const filledMarks = validMarks.filter((v) => v !== null);
  if (filledMarks.length === 0) return 51;

  const totalPct = subjects.reduce((acc, sub) => {
    const val = Number(sub.internalMarks !== undefined ? sub.internalMarks : sub.score) || 0;
    const max = Number(sub.maxMarks || sub.max || 50);
    return acc + (val / max) * 100;
  }, 0);

  return Math.round(totalPct / subjects.length);
}

/**
 * Identify ALL weak subjects tied for the lowest score percentage
 */
export function getWeakSubjects(subjects) {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return [{ code: "2321CSS301J", name: "Embedded System Design (ESD)", internalMarks: 28, maxMarks: 50 }];
  }

  let minRatio = 1.1;

  // Find lowest score ratio
  subjects.forEach((sub) => {
    const val = Number(sub.internalMarks !== undefined ? sub.internalMarks : sub.score) || 0;
    const max = Number(sub.maxMarks || sub.max || 50);
    const ratio = val / max;
    if (ratio < minRatio) {
      minRatio = ratio;
    }
  });

  // Filter ALL subjects matching lowest ratio
  const tiedSubjects = subjects.filter((sub) => {
    const val = Number(sub.internalMarks !== undefined ? sub.internalMarks : sub.score) || 0;
    const max = Number(sub.maxMarks || sub.max || 50);
    const ratio = val / max;
    return Math.abs(ratio - minRatio) < 0.001;
  });

  return tiedSubjects;
}

/**
 * Format tied weak subjects into a clean display string
 */
export function getWeakSubject(subjects) {
  const tied = getWeakSubjects(subjects);
  if (!tied || tied.length === 0) {
    return "2321CSS301J — Embedded System Design (ESD)";
  }
  if (tied.length === 1) {
    return `${tied[0].code} — ${tied[0].name}`;
  }
  return tied.map((s) => {
    const abbrev = s.name.includes('(') ? s.name.split('(')[1]?.replace(')', '') : s.name;
    return `${s.code} (${abbrev})`;
  }).join(' & ');
}

/**
 * Dispatch global custom event for real-time state synchronization
 */
export function notifyMarksUpdated(updatedSubjects) {
  if (updatedSubjects) {
    localStorage.setItem('studentMarks', JSON.stringify(updatedSubjects));
    localStorage.setItem('learnsphere_subjects', JSON.stringify(updatedSubjects));
    const score = calculateReadiness(updatedSubjects);
    if (score !== null) {
      localStorage.setItem('learnsphere_readiness', score.toString());
    }
  }
  window.dispatchEvent(new Event('learnsphere-marks-updated'));
}
