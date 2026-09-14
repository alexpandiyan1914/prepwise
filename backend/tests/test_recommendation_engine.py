import pytest
import sys
from pathlib import Path

# Add root directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.services.skill_normalizer import SkillNormalizer
from backend.services.semantic_matcher import SemanticMatcher
from backend.services.gap_analyzer import SkillGapAnalyzer
from backend.services.recommendation_engine import RecommendationEngine
from backend.services.resource_engine import ResourceEngine
from backend.services.roadmap_engine import RoadmapEngine

class TestRecommendationEngine:
    def setup_method(self):
        self.normalizer = SkillNormalizer()
        self.matcher = SemanticMatcher()
        self.gap_analyzer = SkillGapAnalyzer(self.matcher)
        self.rec_engine = RecommendationEngine()
        self.resource_engine = ResourceEngine()

    def test_skill_normalization(self):
        res_cpp1 = self.normalizer.normalize("c++")
        res_cpp2 = self.normalizer.normalize("cpp")
        res_react1 = self.normalizer.normalize("ReactJS")
        res_react2 = self.normalizer.normalize("react.js")
        res_dsa = self.normalizer.normalize("Data Structures and Algorithms")

        assert res_cpp1["id"] == "cpp"
        assert res_cpp2["id"] == "cpp"
        assert res_react1["id"] == "react"
        assert res_react2["id"] == "react"
        assert res_dsa["id"] == "dsa"

    def test_semantic_matching_and_gap_classification(self):
        student_skills = [
            {"skill_name": "Python", "canonical_id": "python", "proficiency_level": 4, "evidence_text": "4 years production experience"}
        ]
        jd_skills = [
            {"skill_name": "Python", "canonical_id": "python", "is_required": True, "required_proficiency": 4, "context_snippet": "Proficient Python backend engineer"},
            {"skill_name": "Operating Systems", "canonical_id": "operating_systems", "is_required": True, "required_proficiency": 4, "context_snippet": "OS fundamentals"}
        ]

        gaps = self.gap_analyzer.analyze(student_skills, jd_skills)
        gap_map = {g["canonical_id"]: g for g in gaps}

        assert gap_map["python"]["status"] == "STRONG_MATCH"
        assert gap_map["operating_systems"]["status"] == "MISSING"
        assert gap_map["operating_systems"]["gap_score"] > gap_map["python"]["gap_score"]

    def test_larger_gap_increases_priority(self):
        # Two required skills with identical role weights
        gaps = [
            {
                "skill_name": "Operating Systems",
                "canonical_id": "operating_systems",
                "is_required": True,
                "gap_score": 1.0,
                "status": "MISSING"
            },
            {
                "skill_name": "DBMS",
                "canonical_id": "dbms",
                "is_required": True,
                "gap_score": 0.3,
                "status": "PARTIAL_MATCH"
            }
        ]

        recs = self.rec_engine.generate_recommendations(
            gaps,
            target_role="Software Development Engineer",
            preferred_learning=["Practice"],
            student_all_skills=[{"canonical_id": "python"}, {"canonical_id": "sql"}]
        )

        rec_dict = {r["canonical_id"]: r for r in recs}
        assert rec_dict["operating_systems"]["score"] > rec_dict["dbms"]["score"]

    def test_required_ranks_above_preferred(self):
        gaps = [
            {
                "skill_name": "Operating Systems",
                "canonical_id": "operating_systems",
                "is_required": True,
                "gap_score": 0.8,
                "status": "WEAK"
            },
            {
                "skill_name": "Computer Networks",
                "canonical_id": "computer_networks",
                "is_required": False, # preferred
                "gap_score": 0.8,
                "status": "WEAK"
            }
        ]

        recs = self.rec_engine.generate_recommendations(
            gaps,
            target_role="Software Development Engineer",
            preferred_learning=["Practice"],
            student_all_skills=[{"canonical_id": "python"}]
        )

        assert recs[0]["canonical_id"] == "operating_systems"
        assert recs[0]["jd_relevance"] > recs[1]["jd_relevance"]

    def test_prerequisites_affect_ranking(self):
        # If candidate lacks prerequisites for System Design, its readiness drops
        score_without_prereqs, status_missing, _ = self.rec_engine.evaluate_prerequisites(
            "system_design", set()
        )
        score_with_prereqs, status_ready, _ = self.rec_engine.evaluate_prerequisites(
            "system_design", {"dsa", "dbms", "operating_systems"}
        )

        assert score_with_prereqs > score_without_prereqs
        assert status_ready == "Ready"
        assert status_missing == "Needs Foundation"

    def test_user_preference_boosts_without_dominating(self):
        gaps = [
            {
                "skill_name": "DSA",
                "canonical_id": "dsa",
                "is_required": True,
                "gap_score": 0.9,
                "status": "MISSING"
            }
        ]

        recs_pref = self.rec_engine.generate_recommendations(
            gaps, target_role="Software Development Engineer", preferred_learning=["Video", "Practice"]
        )
        recs_no_pref = self.rec_engine.generate_recommendations(
            gaps, target_role="Software Development Engineer", preferred_learning=[]
        )

        diff = recs_pref[0]["score"] - recs_no_pref[0]["score"]
        # Preference is 10% weight, difference should be <= 5 points
        assert 0 < diff <= 6.0

    def test_roadmap_generation(self):
        mock_recs = [
            {"skill_name": "DSA", "canonical_id": "dsa", "priority": "VERY HIGH"},
            {"skill_name": "Operating Systems", "canonical_id": "operating_systems", "priority": "HIGH"},
            {"skill_name": "DBMS", "canonical_id": "dbms", "priority": "HIGH"},
            {"skill_name": "OOP", "canonical_id": "oop", "priority": "MEDIUM"},
            {"skill_name": "Computer Networks", "canonical_id": "computer_networks", "priority": "MEDIUM"}
        ]

        roadmap = RoadmapEngine.generate_5_day_roadmap(mock_recs, daily_hours=3.5)
        assert len(roadmap) == 5
        assert roadmap[0]["day_number"] == 1
        assert roadmap[4]["day_number"] == 5
        assert roadmap[0]["estimated_hours"] == 3.5
