from typing import List, Dict, Any

class ReadinessEngine:
    @staticmethod
    def calculate_readiness_score(gaps: List[Dict[str, Any]], assessment_score: float = None) -> float:
        if not gaps:
            return 50.0

        total_weight = 0.0
        earned_points = 0.0

        status_weights = {
            "STRONG_MATCH": 1.00,
            "PARTIAL_MATCH": 0.65,
            "WEAK": 0.30,
            "MISSING": 0.00
        }

        for gap in gaps:
            # Required skills carry 1.5x weight compared to preferred
            skill_importance_multiplier = 1.5 if gap.get("is_required", True) else 1.0
            total_weight += skill_importance_multiplier

            status = gap.get("status", "MISSING")
            point_ratio = status_weights.get(status, 0.0)

            sim = gap.get("similarity_score", 0.0)
            earned_points += skill_importance_multiplier * (point_ratio * 0.7 + sim * 0.3)

        coverage_ratio = earned_points / total_weight if total_weight > 0 else 0.5
        readiness = coverage_ratio * 100.0

        # Incorporate optional assessment score if student took one (85% skills, 15% assessment)
        if assessment_score is not None and 0.0 <= assessment_score <= 100.0:
            readiness = (readiness * 0.85) + (assessment_score * 0.15)

        return max(5.0, min(98.0, round(readiness, 1)))
