import numpy as np

class ReadinessPredictor:
    """
    ML Engine for predicting Semester Readiness percentage and risk status based on Internal Assessment (IA) scores out of 50.
    Logic:
      - Score > 40: Strong (Low risk)
      - 35 <= Score <= 40: Medium (Average risk)
      - Score < 35: Weak (High risk / Knowledge Gap)
    """

    @staticmethod
    def classify_score(score_out_of_50):
        if score_out_of_50 > 40:
            return "Strong", "emerald"
        elif 35 <= score_out_of_50 <= 40:
            return "Medium", "amber"
        else:
            return "Weak", "rose"

    @staticmethod
    def calculate_readiness(subjects):
        """
        Calculates weighted semester readiness percentage (0-100%) from subject IA scores.
        """
        if not subjects:
            return 78.0, "On Track"

        total_weight = 0
        weighted_score_sum = 0

        for sub in subjects:
            marks = sub.get('internal_marks', 35)
            credits = sub.get('credits', 3)
            percentage = (marks / 50.0) * 100.0
            
            weighted_score_sum += percentage * credits
            total_weight += credits

        if total_weight == 0:
            overall_pct = 78.0
        else:
            overall_pct = round(weighted_score_sum / total_weight, 1)

        # Readiness status text
        if overall_pct >= 75.0:
            status_text = "On Track"
        elif overall_pct >= 60.0:
            status_text = "Needs Focus"
        else:
            status_text = "Critical Risk"

        return overall_pct, status_text
