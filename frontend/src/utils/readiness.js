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
 * Identify primary weak subject from subject array
 */
export function getWeakSubject(subjects) {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return "2321CSS301J — Embedded System Design (ESD)";
  }
  let lowest = null;
  let lowestRatio = 1.1;

  subjects.forEach(sub => {
    const val = Number(sub.internalMarks !== undefined ? sub.internalMarks : sub.score) || 0;
    const max = Number(sub.maxMarks || sub.max || 50);
    const ratio = val / max;
    if (ratio < lowestRatio) {
      lowestRatio = ratio;
      lowest = sub;
    }
  });

  if (lowest) {
    return `${lowest.code} — ${lowest.name}`;
  }
  return "2321CSS301J — Embedded System Design (ESD)";
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
