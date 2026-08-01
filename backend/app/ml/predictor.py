import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

class AcademicRiskPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self._train_initial_model()

    def _train_initial_model(self):
        # Generate synthetic realistic training dataset
        np.random.seed(42)
        n_samples = 500
        
        # Features: [avg_ia_percentage (0-100), avg_quiz_score (0-100), study_hours_per_week (2-30), prev_improvement (-20 to 30)]
        avg_ia = np.random.uniform(30, 95, n_samples)
        avg_quiz = avg_ia + np.random.normal(0, 8, n_samples)
        avg_quiz = np.clip(avg_quiz, 10, 100)
        study_hours = np.random.uniform(4, 28, n_samples)
        improvement = np.random.uniform(-15, 25, n_samples)
        
        X = np.column_stack((avg_ia, avg_quiz, study_hours, improvement))
        
        # Calculate Risk Level (0: High Risk, 1: Moderate Risk, 2: Low Risk)
        y = []
        for i in range(n_samples):
            score = (X[i, 0] * 0.45) + (X[i, 1] * 0.30) + (X[i, 2] * 1.2) + (X[i, 3] * 0.5)
            if score >= 65:
                y.append(2) # Low Risk
            elif score >= 45:
                y.append(1) # Moderate Risk
            else:
                y.append(0) # High Risk

        self.model.fit(X, y)

    def classify_subject_status(self, marks, max_marks=50.0):
        """
        Mark Analysis Logic:
        Marks out of 50:
        Above 40 -> Strong
        35–40 -> Medium
        Below 35 -> Weak
        """
        # Normalize to 50 scale if max_marks != 50
        scaled_marks = (marks / max_marks) * 50.0
        if scaled_marks > 40.0:
            return "Strong"
        elif scaled_marks >= 35.0:
            return "Medium"
        else:
            return "Weak"

    def predict_readiness(self, subjects_list, quiz_avg_score=75.0, study_hours=14.0, prev_improvement=10.0):
        """
        Evaluates student performance across subjects and predicts:
        - Readiness Score (0-100)
        - Risk Level ('Low', 'Moderate', 'High')
        - Predicted GPA
        - Weak, Medium, Strong subject lists
        """
        if not subjects_list:
            subjects_list = [
                {'name': 'Data Structures', 'ia_marks': 32, 'max_marks': 50},
                {'name': 'Database Management', 'ia_marks': 42, 'max_marks': 50},
                {'name': 'Operating Systems', 'ia_marks': 37, 'max_marks': 50},
                {'name': 'Computer Networks', 'ia_marks': 28, 'max_marks': 50},
            ]

        strong_subjects = []
        medium_subjects = []
        weak_subjects = []
        total_pct = 0.0

        for subj in subjects_list:
            marks = float(subj.get('ia_marks', 30))
            max_m = float(subj.get('max_marks', 50))
            status = self.classify_subject_status(marks, max_m)
            subj['status'] = status
            
            pct = (marks / max_m) * 100
            total_pct += pct

            if status == "Strong":
                strong_subjects.append(subj['name'])
            elif status == "Medium":
                medium_subjects.append(subj['name'])
            else:
                weak_subjects.append(subj['name'])

        avg_ia_pct = total_pct / len(subjects_list)

        # ML Feature Vector
        X_input = np.array([[avg_ia_pct, quiz_avg_score, study_hours, prev_improvement]])
        risk_class_idx = int(self.model.predict(X_input)[0])
        risk_map = {0: "High", 1: "Moderate", 2: "Low"}
        risk_level = risk_map.get(risk_class_idx, "Moderate")

        # Readiness Score formula combining ML prediction and raw performance
        base_readiness = (avg_ia_pct * 0.5) + (quiz_avg_score * 0.3) + min(study_hours * 1.2, 20)
        readiness_score = round(min(max(base_readiness, 15.0), 98.0), 1)

        # Predicted GPA (out of 10)
        predicted_gpa = round(min(max((readiness_score / 10.0) + 0.5, 4.0), 9.9), 2)

        return {
            "readiness_score": readiness_score,
            "risk_level": risk_level,
            "predicted_gpa": predicted_gpa,
            "strong_subjects": strong_subjects,
            "medium_subjects": medium_subjects,
            "weak_subjects": weak_subjects,
            "average_ia_percentage": round(avg_ia_pct, 1)
        }

predictor = AcademicRiskPredictor()
