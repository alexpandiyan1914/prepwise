import os
import sys
import math
from pathlib import Path
from typing import List, Dict, Set

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.services.skill_normalizer import SkillNormalizer
from backend.services.skill_extractor import SkillExtractor
from backend.services.semantic_matcher import SemanticMatcher
from backend.services.gap_analyzer import SkillGapAnalyzer
from backend.services.recommendation_engine import RecommendationEngine
from backend.routes.demo_routes import SAMPLE_CASES

def compute_precision_at_k(recommended: List[str], ground_truth: Set[str], k: int = 5) -> float:
    top_k = recommended[:k]
    if not top_k:
        return 0.0
    hits = sum(1 for item in top_k if item in ground_truth)
    return hits / k

def compute_recall_at_k(recommended: List[str], ground_truth: Set[str], k: int = 5) -> float:
    if not ground_truth:
        return 1.0
    top_k = recommended[:k]
    hits = sum(1 for item in top_k if item in ground_truth)
    return hits / len(ground_truth)

def compute_dcg_at_k(recommended: List[str], ground_truth: Dict[str, int], k: int = 5) -> float:
    dcg = 0.0
    for idx, item in enumerate(recommended[:k]):
        rel = ground_truth.get(item, 0)
        dcg += (2**rel - 1) / math.log2(idx + 2)
    return dcg

def compute_ndcg_at_k(recommended: List[str], ground_truth: Dict[str, int], k: int = 5) -> float:
    actual_dcg = compute_dcg_at_k(recommended, ground_truth, k)
    ideal_sorted = sorted(ground_truth.values(), reverse=True)[:k]
    idcg = 0.0
    for idx, rel in enumerate(ideal_sorted):
        idcg += (2**rel - 1) / math.log2(idx + 2)
    if idcg == 0.0:
        return 1.0
    return actual_dcg / idcg

def evaluate_all():
    print("=" * 60)
    print("   PrepWise Recommendation Engine Offline Evaluation   ")
    print("=" * 60)

    ground_truth_cases = {
        "sde": {
            "title": "Software Development Engineer (SDE)",
            "ground_truth_relevance": {
                "dsa": 3,
                "operating_systems": 3,
                "dbms": 3,
                "problem_solving": 3,
                "system_design": 2,
                "computer_networks": 2,
                "java": 2,
                "cpp": 2
            }
        },
        "frontend": {
            "title": "Frontend Developer",
            "ground_truth_relevance": {
                "react": 3,
                "javascript": 3,
                "html": 2,
                "css": 2,
                "rest_api": 3,
                "typescript": 2
            }
        },
        "data_analyst": {
            "title": "Data Analyst",
            "ground_truth_relevance": {
                "sql": 3,
                "pandas": 3,
                "python": 3,
                "numpy": 2,
                "dbms": 2,
                "machine_learning": 2
            }
        },
        "backend": {
            "title": "Backend Developer",
            "ground_truth_relevance": {
                "rest_api": 3,
                "dbms": 3,
                "system_design": 3,
                "dsa": 3,
                "postgresql": 2,
                "git": 2,
                "docker": 2
            }
        }
    }

    extractor = SkillExtractor()
    matcher = SemanticMatcher()
    gap_analyzer = SkillGapAnalyzer(matcher)
    rec_engine = RecommendationEngine()

    total_p5, total_r5, total_ndcg5 = 0.0, 0.0, 0.0
    count = len(ground_truth_cases)

    for case_id, gt_info in ground_truth_cases.items():
        sample = SAMPLE_CASES[case_id]
        role_title = sample["student"]["target_role"]
        
        student_skills = extractor.extract_skills_from_text(sample["resume_text"], "resume")
        jd_skills = extractor.extract_skills_from_text(sample["jd_text"], "jd_required")
        for s in jd_skills:
            s["is_required"] = True
            
        gaps = gap_analyzer.analyze(student_skills, jd_skills)
        recs = rec_engine.generate_recommendations(
            gaps,
            target_role=role_title,
            preferred_learning=sample["student"]["preferred_learning"],
            student_all_skills=student_skills
        )

        rec_c_ids = [r["canonical_id"] for r in recs]
        gt_relevance = gt_info["ground_truth_relevance"]
        gt_set = set(gt_relevance.keys())

        p5 = compute_precision_at_k(rec_c_ids, gt_set, k=5)
        r5 = compute_recall_at_k(rec_c_ids, gt_set, k=5)
        ndcg5 = compute_ndcg_at_k(rec_c_ids, gt_relevance, k=5)

        total_p5 += p5
        total_r5 += r5
        total_ndcg5 += ndcg5

        print(f"\n[BENCHMARK] {gt_info['title']}")
        print(f"  Recommended Top 5: {rec_c_ids[:5]}")
        print(f"  Expected Relevant: {list(gt_set)}")
        print(f"  Precision@5: {p5:.3f} | Recall@5: {r5:.3f} | NDCG@5: {ndcg5:.3f}")

    avg_p5 = total_p5 / count
    avg_r5 = total_r5 / count
    avg_ndcg5 = total_ndcg5 / count

    print("\n" + "=" * 60)
    print("                AGGREGATE EVALUATION METRICS               ")
    print("=" * 60)
    print(f"Mean Precision@5: {avg_p5:.4f} (target > 0.80)")
    print(f"Mean Recall@5:    {avg_r5:.4f} (target > 0.70)")
    print(f"Mean NDCG@5:      {avg_ndcg5:.4f} (target > 0.85)")
    print("=" * 60)

if __name__ == "__main__":
    evaluate_all()
