from typing import List, Dict, Any
from backend.services.semantic_matcher import SemanticMatcher

class SkillGapAnalyzer:
    def __init__(self, matcher: SemanticMatcher = None):
        self.matcher = matcher or SemanticMatcher()

    def analyze(self, student_skills: List[Dict[str, Any]], jd_skills: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        student_skill_map = {s["canonical_id"]: s for s in student_skills}
        gaps = []

        for jd_skill in jd_skills:
            c_id = jd_skill["canonical_id"]
            skill_name = jd_skill["skill_name"]
            is_req = jd_skill.get("is_required", True)
            req_level = jd_skill.get("required_proficiency", 4 if is_req else 3)
            jd_snippet = jd_skill.get("context_snippet") or f"Required for {skill_name}"

            matched_student_skill = student_skill_map.get(c_id)
            student_evidence = None
            student_level = 0
            similarity = 0.0

            if matched_student_skill:
                student_level = matched_student_skill.get("proficiency_level", 2)
                student_evidence = matched_student_skill.get("evidence_text")
                similarity = self.matcher.compute_similarity(
                    student_evidence or skill_name,
                    jd_snippet,
                    canonical_match=True
                )
            else:
                best_sim = 0.0
                best_match = None
                for cand_c_id, cand_skill in student_skill_map.items():
                    sim = self.matcher.compute_similarity(
                        cand_skill.get("evidence_text") or cand_skill["skill_name"],
                        jd_snippet,
                        canonical_match=False
                    )
                    if sim > best_sim:
                        best_sim = sim
                        best_match = cand_skill

                if best_sim >= 0.50 and best_match:
                    similarity = best_sim
                    student_level = max(1, best_match.get("proficiency_level", 2) - 1)
                    matched_name = best_match["skill_name"]
                    ev_snip = best_match.get("evidence_text", "")
                    student_evidence = f"Related background via {matched_name}: {ev_snip}"
                else:
                    similarity = best_sim

            effective_competency = (student_level / 5.0) * similarity
            required_target = req_level / 5.0
            raw_gap = max(0.0, min(1.0, (required_target - effective_competency) / required_target))

            if similarity >= 0.80 and student_level >= (req_level - 1) and raw_gap <= 0.25:
                status = "STRONG_MATCH"
                explanation = f"Strong alignment: Resume demonstrates solid {skill_name} capabilities matching the job criteria."
            elif (similarity >= 0.55 and student_level >= 2) or (0.25 < raw_gap <= 0.55):
                status = "PARTIAL_MATCH"
                explanation = f"Partial alignment: Resume indicates basic/intermediate familiarity with {skill_name}, but needs deepening for interview standards."
            elif similarity >= 0.35 or student_level == 1 or (0.55 < raw_gap <= 0.80):
                status = "WEAK"
                explanation = f"Weak evidence: Limited or introductory reference to {skill_name} detected. Substantial preparation recommended."
            else:
                status = "MISSING"
                explanation = f"Missing requirement: No detectable resume evidence for {skill_name}, which is explicitly sought in the target JD."

            gaps.append({
                "skill_name": skill_name,
                "canonical_id": c_id,
                "is_required": is_req,
                "student_level": student_level,
                "required_level": req_level,
                "similarity_score": round(similarity, 3),
                "gap_score": round(raw_gap, 3),
                "status": status,
                "student_evidence": student_evidence or "No explicit mention found in resume.",
                "jd_requirement": jd_snippet,
                "explanation": explanation
            })

        return gaps
