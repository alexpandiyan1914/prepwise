import json
from pathlib import Path
from typing import List, Dict, Any

class RecommendationEngine:
    def __init__(self, config_dir: str = None):
        if not config_dir:
            config_dir = str(Path(__file__).parent.parent / "data")
            
        self.config_dir = Path(config_dir)
        self.prerequisites = self._load_json("prerequisites.json", {})
        self.role_importance_map = self._load_json("role_importance.json", {})
        
        self.action_guides = {
            "dsa": "Master Trees, Graphs, Dynamic Programming, and Binary Search interview patterns on LeetCode.",
            "operating_systems": "Revise Process Scheduling, Thread Synchronization, Deadlock Handling, and Virtual Memory Paging.",
            "dbms": "Practice SQL Joins, BCNF Normalization, Indexing strategies, and ACID Transaction Isolation.",
            "oop": "Deepen 4 Pillars (Polymorphism, Inheritance, Encapsulation, Abstraction) and LLD Design Patterns.",
            "computer_networks": "Understand TCP 3-Way Handshake, OSI Layers, DNS Resolution, and HTTP vs HTTPS.",
            "system_design": "Study Scalability, Caching with Redis, Load Balancers, and Database Sharding architectures.",
            "problem_solving": "Practice timed medium-difficulty placement questions with edge-case consideration.",
            "python": "Consolidate Pythonic idioms, Generators, Decorators, and Collections for technical assessments.",
            "java": "Revise Java Memory Model, JVM Garbage Collection, Multithreading, and Collections Framework.",
            "cpp": "Master C++ STL (Vectors, Maps, Sets) and pointer/reference memory management.",
            "react": "Strengthen React Hooks (useEffect, useMemo), State Management, and Component Lifecycle.",
            "javascript": "Master Closures, Event Loop, Promises, Async/Await, and Scope chaining.",
            "sql": "Solve Complex Group By, Window Functions (ROW_NUMBER, RANK), and Correlated Subqueries.",
            "rest_api": "Design idempotent REST endpoints with HTTP status codes and authentication token headers."
        }

    def _load_json(self, filename: str, default: Any) -> Any:
        path = self.config_dir / filename
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return default

    def evaluate_prerequisites(self, canonical_id: str, student_skills_set: set) -> tuple:
        """Returns (score_0_to_100, status_str, notes_str)"""
        prereq_info = self.prerequisites.get(canonical_id)
        if not prereq_info:
            return 95.0, "Ready", "No strict prerequisites required for this topic."

        req_list = prereq_info.get("prerequisites", [])
        min_needed = prereq_info.get("min_match_needed", 1)
        satisfied = [r for r in req_list if r in student_skills_set]

        if len(satisfied) >= min_needed:
            sat_str = ", ".join(satisfied)
            return 92.0, "Ready", f"Prerequisites satisfied ({sat_str})."
        elif len(satisfied) > 0:
            sat_str = ", ".join(satisfied)
            return 65.0, "Partially Ready", f"Partially satisfied ({sat_str}). Foundational review recommended."
        else:
            req_str = ", ".join(req_list)
            return 30.0, "Needs Foundation", f"Prerequisite ({req_str}) missing. Establish core foundation first."

    def get_role_importance(self, target_role: str, canonical_id: str) -> float:
        role_key = "Default"
        target_lower = target_role.lower() if target_role else ""
        for key in self.role_importance_map:
            if key.lower() in target_lower or target_lower in key.lower():
                role_key = key
                break

        weights = self.role_importance_map.get(role_key, self.role_importance_map.get("Default", {}))
        return weights.get(canonical_id, 0.70)

    def calculate_preference_score(self, preferred_learning: List[str]) -> float:
        if preferred_learning:
            return 85.0
        return 50.0

    def generate_recommendations(
        self,
        gaps: List[Dict[str, Any]],
        target_role: str,
        preferred_learning: List[str] = None,
        student_all_skills: List[Dict[str, Any]] = None,
        learning_history_score: float = 50.0
    ) -> List[Dict[str, Any]]:
        # Full set of known student competencies
        if student_all_skills:
            student_skills_set = {s["canonical_id"] for s in student_all_skills}
        else:
            student_skills_set = {
                g["canonical_id"] for g in gaps if g.get("status") in ("STRONG_MATCH", "PARTIAL_MATCH")
            }

        recommendations = []

        for gap in gaps:
            c_id = gap["canonical_id"]
            skill_name = gap["skill_name"]
            is_req = gap.get("is_required", True)
            gap_score = gap.get("gap_score", 0.8)

            # 1. JD Relevance (0-100)
            jd_relevance = 95.0 if is_req else 75.0

            # 2. Skill Gap Factor (0-100)
            skill_gap_factor = gap_score * 100.0

            # 3. Role Importance (0-100)
            role_imp_weight = self.get_role_importance(target_role, c_id)
            role_importance = role_imp_weight * 100.0

            # 4. Prerequisite Readiness (0-100)
            prereq_readiness, prereq_status, prereq_notes = self.evaluate_prerequisites(c_id, student_skills_set)

            # 5. User Preference (0-100)
            user_pref = self.calculate_preference_score(preferred_learning)

            # 6. Learning History (0-100)
            history_val = learning_history_score

            # PRD Formula:
            # Score = 0.30*JD + 0.25*Gap + 0.20*Role + 0.10*Prereq + 0.10*Pref + 0.05*History
            final_score = (
                0.30 * jd_relevance +
                0.25 * skill_gap_factor +
                0.20 * role_importance +
                0.10 * prereq_readiness +
                0.10 * user_pref +
                0.05 * history_val
            )
            final_score = max(5.0, min(100.0, final_score))

            if final_score >= 80.0:
                priority = "VERY HIGH"
            elif final_score >= 65.0:
                priority = "HIGH"
            elif final_score >= 45.0:
                priority = "MEDIUM"
            else:
                priority = "LOW"

            why_bullets = []
            if is_req:
                why_bullets.append(f"{skill_name} is explicitly required in the target {target_role} JD.")
            else:
                why_bullets.append(f"{skill_name} is a preferred placement competency for this profile.")

            if gap.get("status") == "MISSING":
                why_bullets.append("Your resume contains no detectable evidence for this topic, creating an interview risk.")
            elif gap.get("status") == "WEAK":
                why_bullets.append("Your resume indicates introductory exposure; placement technical rounds demand deeper competency.")
            elif gap.get("status") == "PARTIAL_MATCH":
                why_bullets.append("You possess foundational familiarity, but targeted problem-solving and scenario drills are needed.")

            why_bullets.append(f"Holds high role weight ({int(role_importance)}/100) for {target_role}.")
            why_bullets.append(f"Prerequisite status: {prereq_status} ({prereq_notes})")

            why_text = " ".join(why_bullets)
            action_plan = self.action_guides.get(c_id, f"Review core fundamentals, implement practical projects, and practice placement problems in {skill_name}.")

            recommendations.append({
                'skill_name': skill_name,
                'canonical_id': c_id,
                'priority': priority,
                'score': round(final_score, 1),
                'gap_level': gap.get('status', 'MISSING'),
                'jd_relevance': round(jd_relevance, 1),
                'skill_gap_factor': round(skill_gap_factor, 1),
                'role_importance': round(role_importance, 1),
                'prerequisite_readiness': round(prereq_readiness, 1),
                'user_preference': round(user_pref, 1),
                'learning_history': round(history_val, 1),
                'why_recommended': why_text,
                'action_plan': action_plan,
                'estimated_hours': 8.0 if priority == "VERY HIGH" else 5.0,
                'prerequisite_status': prereq_status,
                'prerequisite_notes': prereq_notes
            })

        recommendations.sort(key=lambda r: r['score'], reverse=True)

        for idx, rec in enumerate(recommendations):
            rec['rank'] = idx + 1

        return recommendations
