import { createClient } from '@supabase/supabase-js';

// Environment variables fallback for development and offline demo mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-learnsphere.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Student Profile Services
 */
export const studentService = {
  async getProfile(userId) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('Supabase getProfile error:', error.message);
      return null;
    }
    return data;
  },

  async updateReadiness(userId, score) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('students')
      .update({ semester_readiness: score })
      .eq('id', userId)
      .select()
      .single();
    if (error) {
      console.warn('Supabase updateReadiness error:', error.message);
      return null;
    }
    return data;
  }
};

/**
 * Internal Assessment (IA) Marks Services
 */
export const iaMarksService = {
  async getStudentMarks(studentId) {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('ia_marks')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getStudentMarks error:', error.message);
      return [];
    }
    return data || [];
  },

  async insertMark({ studentId, subjectName, score, maxScore = 50 }) {
    // Level calculation based on score out of 50
    let level = 'Strong';
    if (score < 35) level = 'Weak';
    else if (score <= 40) level = 'Medium';

    if (!isSupabaseConfigured()) {
      return {
        id: 'mock-' + Date.now(),
        student_id: studentId,
        subject_name: subjectName,
        score: Number(score),
        max_score: maxScore,
        level,
        created_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('ia_marks')
      .insert([{
        student_id: studentId,
        subject_name: subjectName,
        score: Number(score),
        max_score: maxScore,
        level
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insertMark error:', error.message);
      throw error;
    }
    return data;
  }
};

/**
 * Weekly Progress & Adaptive Quiz Services
 */
export const weeklyProgressService = {
  async getWeeklyProgress(studentId) {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('weekly_progress')
      .select('*')
      .eq('student_id', studentId)
      .order('week_number', { ascending: true });
    if (error) {
      console.warn('Supabase getWeeklyProgress error:', error.message);
      return [];
    }
    return data || [];
  },

  async saveQuizResult({ studentId, weekNumber, easyCount, mediumCount, hardCount, quizScorePct, completed = true }) {
    if (!isSupabaseConfigured()) {
      return {
        id: 'mock-wp-' + Date.now(),
        student_id: studentId,
        week_number: weekNumber,
        easy_count: easyCount,
        medium_count: mediumCount,
        hard_count: hardCount,
        quiz_score_pct: quizScorePct,
        completed,
        created_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('weekly_progress')
      .insert([{
        student_id: studentId,
        week_number: weekNumber,
        easy_count: easyCount,
        medium_count: mediumCount,
        hard_count: hardCount,
        quiz_score_pct: quizScorePct,
        completed
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase saveQuizResult error:', error.message);
      throw error;
    }
    return data;
  }
};

/**
 * Faculty Interventions Services
 */
export const interventionsService = {
  async getInterventions() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('interventions')
      .select('*, students(name, email)')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getInterventions error:', error.message);
      return [];
    }
    return data || [];
  },

  async createIntervention({ studentId, subject, status = 'Flagged' }) {
    if (!isSupabaseConfigured()) {
      return {
        id: 'mock-int-' + Date.now(),
        student_id: studentId,
        subject,
        status,
        created_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('interventions')
      .insert([{
        student_id: studentId,
        subject,
        status
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase createIntervention error:', error.message);
      throw error;
    }
    return data;
  },

  async updateStatus(interventionId, status) {
    if (!isSupabaseConfigured()) return { id: interventionId, status };

    const { data, error } = await supabase
      .from('interventions')
      .update({ status })
      .eq('id', interventionId)
      .select()
      .single();

    if (error) {
      console.error('Supabase updateStatus error:', error.message);
      throw error;
    }
    return data;
  }
};
