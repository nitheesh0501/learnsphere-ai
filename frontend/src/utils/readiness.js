/**
 * Unified Readiness Calculator Utility for LearnSphere AI
 * Calculates exact overall readiness percentage across 7 Semester 3 subjects.
 * Shared between Student Hub, App.jsx, and Faculty Analytics.
 */

/**
 * Safe localStorage read & JSON deserialization with fallback
 */
export const getSafeLocalStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
    return fallback;
  }
};

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

const DEFAULT_ASSESSMENT_SCORES = {
  '2321MAB301T': { score: 9, total: 10, pct: 90 },
  '2321CSC301T': { score: 7, total: 10, pct: 70 },
  '2321CSC302J': { score: 6, total: 10, pct: 60 },
  '2321CSC303J': { score: 8, total: 10, pct: 80 },
  '2321CSS301J': { score: 4, total: 10, pct: 40 },
  '2321CSC304R': { score: 5, total: 10, pct: 50 },
  '2321SDA301L': { score: 9, total: 10, pct: 90 }
};

/**
 * Get assessment quiz practice scores for all 7 Semester 3 subjects
 */
export function getAssessmentScores() {
  return getSafeLocalStorage('assessmentScores', DEFAULT_ASSESSMENT_SCORES);
}

/**
 * Save assessment quiz score for a specific subject code into localStorage
 */
export function saveAssessmentScore(subjectCode, score, total = 10) {
  const current = getAssessmentScores();
  const pct = Math.round((score / total) * 100);
  current[subjectCode] = { score, total, pct };
  localStorage.setItem('assessmentScores', JSON.stringify(current));
  window.dispatchEvent(new Event('learnsphere-marks-updated'));
}

/**
 * Identify ALL weak subjects tied for the lowest numerical score out of 50
 */
export function getWeakSubjects(subjects) {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return [{ code: "2321CSS301J", name: "Embedded System Design (ESD)", internalMarks: 28, maxMarks: 50 }];
  }

  const validCourses = subjects.map(c => {
    const rawVal = c.internalMarks !== undefined ? c.internalMarks : (c.score !== undefined ? c.score : 0);
    const numericScore = rawVal === '' || rawVal === null || isNaN(Number(rawVal)) ? 0 : Number(rawVal);
    const maxMarks = Number(c.maxMarks || c.max || 50);
    return {
      ...c,
      numericScore,
      maxMarks,
      ratio: numericScore / maxMarks
    };
  });

  // Find absolute minimum score ratio
  const minRatio = Math.min(...validCourses.map(c => c.ratio));

  // Filter ALL subjects matching lowest score ratio
  const lowestSubjects = validCourses.filter(c => Math.abs(c.ratio - minRatio) < 0.0001);

  return lowestSubjects;
}

/**
 * Format tied weak subjects into a clean display string
 */
export function getWeakSubject(subjects) {
  const lowest = getWeakSubjects(subjects);
  if (!lowest || lowest.length === 0) {
    return "2321CSS301J — Embedded System Design (ESD)";
  }
  if (lowest.length === 1) {
    return `${lowest[0].code} — ${lowest[0].name}`;
  }
  return lowest.map((s) => {
    const nameStr = s.name || s.title || s.code || '';
    const abbrev = nameStr.includes('(') ? nameStr.split('(')[1]?.replace(')', '') : nameStr;
    return s.code ? `${s.code} (${abbrev})` : nameStr;
  }).join(' & ');
}

export const getWeakestSubjects = getWeakSubject;

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
