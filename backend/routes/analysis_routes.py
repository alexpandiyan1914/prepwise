import json
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app
from backend.extensions import db
from backend.models.student import Student, StudentSkill
from backend.models.job import Job, JobSkill
from backend.models.recommendation import Analysis, SkillGap, Recommendation
from backend.models.resource import Resource, RoadmapItem

from backend.services.resume_parser import ResumeParser
from backend.services.jd_parser import JobDescriptionParser
from backend.services.skill_extractor import SkillExtractor
from backend.services.semantic_matcher import SemanticMatcher
from backend.services.gap_analyzer import SkillGapAnalyzer
from backend.services.readiness_engine import ReadinessEngine
from backend.services.recommendation_engine import RecommendationEngine
from backend.services.resource_engine import ResourceEngine
from backend.services.roadmap_engine import RoadmapEngine

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api")

@analysis_bp.route("/analyze", methods=["POST"])
def run_analysis():
    try:
        # Check if multipart form or JSON
        if request.content_type and "multipart/form-data" in request.content_type:
            form_data = request.form
            student_name = form_data.get("name", "Student").strip()
            target_role = form_data.get("target_role", "Software Development Engineer").strip()
            company_name = form_data.get("company_name", "Target Tech Corp").strip()
            exp_level = form_data.get("experience_level", "Beginner")
            daily_hours = float(form_data.get("daily_prep_hours", 3.0))
            pref_raw = form_data.get("preferred_learning", "Practice, Video")
            preferred_learning = [p.strip() for p in pref_raw.split(",") if p.strip()]
            assessment_score = float(form_data.get("assessment_score")) if form_data.get("assessment_score") else None

            # Resume
            resume_text = ""
            if "resume_file" in request.files and request.files["resume_file"].filename:
                file = request.files["resume_file"]
                upload_dir = Path(current_app.config["UPLOAD_FOLDER"])
                upload_dir.mkdir(parents=True, exist_ok=True)
                save_path = upload_dir / f"analysis_{file.filename}"
                file.save(str(save_path))
                resume_text = ResumeParser.extract_text(str(save_path))
            else:
                resume_text = form_data.get("resume_text", "")

            # JD
            jd_text = ""
            if "jd_file" in request.files and request.files["jd_file"].filename:
                file = request.files["jd_file"]
                upload_dir = Path(current_app.config["UPLOAD_FOLDER"])
                upload_dir.mkdir(parents=True, exist_ok=True)
                save_path = upload_dir / f"analysis_{file.filename}"
                file.save(str(save_path))
                jd_text = JobDescriptionParser.extract_text(str(save_path))
            else:
                jd_text = form_data.get("jd_text", "")
        else:
            data = request.get_json() or {}
            student_data = data.get("student", {})
            job_data = data.get("job", {})
            
            student_name = student_data.get("name", "Student").strip()
            target_role = student_data.get("target_role", "Software Development Engineer").strip()
            exp_level = student_data.get("experience_level", "Beginner")
            daily_hours = float(student_data.get("daily_prep_hours", 3.0))
            preferred_learning = student_data.get("preferred_learning", ["Practice", "Video"])
            assessment_score = student_data.get("assessment_score")

            company_name = job_data.get("company_name", "Target Tech Corp").strip()
            resume_text = data.get("resume_text", "")
            jd_text = job_data.get("raw_text", data.get("jd_text", ""))

        if not resume_text or not resume_text.strip():
            return jsonify({"error": "Resume content is required. Please upload a resume or provide text."}), 400
        if not jd_text or not jd_text.strip():
            return jsonify({"error": "Job description is required. Please upload or paste a JD."}), 400

        # Step 1: Parse Resume & JD
        parsed_resume = ResumeParser.parse(raw_text=resume_text)
        parsed_jd = JobDescriptionParser.parse(raw_text=jd_text, company=company_name, role=target_role)

        # Step 2: Extract & Normalize Skills
        extractor = SkillExtractor()
        student_skills = extractor.extract_skills_from_text(parsed_resume["full_text"], source_type="resume")
        
        req_text = parsed_jd["required_text"] or parsed_jd["full_text"]
        pref_text = parsed_jd["preferred_text"]
        
        jd_required_skills = extractor.extract_skills_from_text(req_text, source_type="jd_required")
        for s in jd_required_skills:
            s["is_required"] = True
            
        jd_preferred_skills = extractor.extract_skills_from_text(pref_text, source_type="jd_preferred") if pref_text else []
        for s in jd_preferred_skills:
            s["is_required"] = False

        # Merge JD skills, avoiding duplicate canonical IDs (required takes precedence)
        jd_skills_map = {}
        for s in jd_required_skills:
            jd_skills_map[s["canonical_id"]] = s
        for s in jd_preferred_skills:
            if s["canonical_id"] not in jd_skills_map:
                jd_skills_map[s["canonical_id"]] = s
        all_jd_skills = list(jd_skills_map.values())

        if not all_jd_skills:
            # Fallback default SDE core skills if JD was too abstract
            default_c_ids = ["dsa", "oop", "dbms", "operating_systems", "problem_solving"]
            for cid in default_c_ids:
                all_jd_skills.append({
                    "skill_name": cid.upper() if len(cid) <= 4 else cid.replace("_", " ").title(),
                    "canonical_id": cid,
                    "category": "CS Fundamentals",
                    "proficiency_level": 4,
                    "is_required": True,
                    "context_snippet": f"Core technical foundation required for {target_role}"
                })

        # Step 3: Semantic Matching & Gap Analysis
        matcher = SemanticMatcher()
        gap_analyzer = SkillGapAnalyzer(matcher=matcher)
        gaps = gap_analyzer.analyze(student_skills=student_skills, jd_skills=all_jd_skills)

        # Step 4: Readiness Score Calculation
        readiness_score = ReadinessEngine.calculate_readiness_score(gaps=gaps, assessment_score=assessment_score)

        # Step 5: Multi-Factor Recommendation Engine
        rec_engine = RecommendationEngine()
        recommendations = rec_engine.generate_recommendations(
            gaps=gaps,
            target_role=target_role,
            preferred_learning=preferred_learning
        )

        # Step 6: Resource Engine Mapping
        res_engine = ResourceEngine()
        all_resources = []
        for rec in recommendations[:5]:
            rec_res = res_engine.get_resources_for_skill(rec["canonical_id"], preferred_types=preferred_learning)
            rec["resources"] = rec_res
            all_resources.extend(rec_res)

        # Step 7: 5-Day Personalized Preparation Roadmap
        roadmap = RoadmapEngine.generate_5_day_roadmap(recommendations=recommendations, daily_hours=daily_hours)

        # Step 8: Persist in SQLite Database
        student = Student(
            name=student_name,
            target_role=target_role,
            experience_level=exp_level,
            daily_prep_hours=daily_hours,
            preferred_learning=",".join(preferred_learning),
            assessment_score=assessment_score
        )
        db.session.add(student)
        db.session.flush()

        for s in student_skills:
            db.session.add(StudentSkill(
                student_id=student.id,
                skill_name=s["skill_name"],
                canonical_id=s["canonical_id"],
                proficiency_level=s.get("proficiency_level", 2),
                evidence_text=s.get("evidence_text"),
                source="resume"
            ))

        job = Job(
            company_name=company_name,
            role_title=target_role,
            raw_text=jd_text
        )
        db.session.add(job)
        db.session.flush()

        for js in all_jd_skills:
            db.session.add(JobSkill(
                job_id=job.id,
                skill_name=js["skill_name"],
                canonical_id=js["canonical_id"],
                is_required=js.get("is_required", True),
                required_proficiency=js.get("proficiency_level", 4),
                context_snippet=js.get("context_snippet")
            ))

        analysis = Analysis(
            student_id=student.id,
            job_id=job.id,
            readiness_score=readiness_score,
            nlp_method_used=matcher.method_used
        )
        db.session.add(analysis)
        db.session.flush()

        for g in gaps:
            db.session.add(SkillGap(
                analysis_id=analysis.id,
                skill_name=g["skill_name"],
                canonical_id=g["canonical_id"],
                is_required=g["is_required"],
                student_level=g["student_level"],
                required_level=g["required_level"],
                similarity_score=g["similarity_score"],
                gap_score=g["gap_score"],
                status=g["status"],
                student_evidence=g["student_evidence"],
                jd_requirement=g["jd_requirement"],
                explanation=g["explanation"]
            ))

        for r in recommendations:
            db.session.add(Recommendation(
                analysis_id=analysis.id,
                rank=r["rank"],
                skill_name=r["skill_name"],
                canonical_id=r["canonical_id"],
                priority=r["priority"],
                score=r["score"],
                gap_level=r["gap_level"],
                jd_relevance=r["jd_relevance"],
                skill_gap_factor=r["skill_gap_factor"],
                role_importance=r["role_importance"],
                prerequisite_readiness=r["prerequisite_readiness"],
                user_preference=r["user_preference"],
                learning_history=r["learning_history"],
                why_recommended=r["why_recommended"],
                action_plan=r["action_plan"],
                estimated_hours=r["estimated_hours"],
                prerequisite_status=r["prerequisite_status"],
                prerequisite_notes=r["prerequisite_notes"]
            ))

        for item in roadmap:
            db.session.add(RoadmapItem(
                analysis_id=analysis.id,
                day_number=item["day_number"],
                title=item["title"],
                canonical_id=item["canonical_id"],
                focus_topics=json.dumps(item["focus_topics"]),
                action_items=json.dumps(item["action_items"]),
                estimated_hours=item["estimated_hours"],
                priority=item["priority"]
            ))

        db.session.commit()

        # Categorize skills for the dashboard
        categorized_skills = {
            "strong": [g for g in gaps if g["status"] == "STRONG_MATCH"],
            "partial": [g for g in gaps if g["status"] == "PARTIAL_MATCH"],
            "weak": [g for g in gaps if g["status"] == "WEAK"],
            "missing": [g for g in gaps if g["status"] == "MISSING"]
        }

        return jsonify({
            "analysis_id": analysis.id,
            "nlp_method_used": matcher.method_used,
            "student": {
                "id": student.id,
                "name": student.name,
                "target_role": student.target_role,
                "experience_level": student.experience_level,
                "daily_prep_hours": student.daily_prep_hours,
                "preferred_learning": preferred_learning,
                "assessment_score": student.assessment_score
            },
            "job": {
                "id": job.id,
                "company": job.company_name,
                "role": job.role_title
            },
            "readiness_score": readiness_score,
            "metrics": {
                "total_skills_analyzed": len(gaps),
                "strong_count": len(categorized_skills["strong"]),
                "partial_count": len(categorized_skills["partial"]),
                "weak_count": len(categorized_skills["weak"]),
                "missing_count": len(categorized_skills["missing"])
            },
            "skills": categorized_skills,
            "all_gaps": gaps,
            "recommendations": recommendations,
            "top_recommendations": recommendations[:5],
            "roadmap": roadmap,
            "resources": all_resources[:12]
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Analysis pipeline error: {str(e)}"}), 500

@analysis_bp.route("/analysis/<int:analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    analysis = db.session.get(Analysis, analysis_id)
    if not analysis:
        return jsonify({"error": "Analysis record not found"}), 404
        
    gaps = [g.to_dict() for g in analysis.gaps]
    recs = [r.to_dict() for r in analysis.recommendations]
    roadmap = [rm.to_dict() for rm in analysis.roadmap_items]
    
    # Attach resources
    res_engine = ResourceEngine()
    pref = [p.strip() for p in (analysis.student.preferred_learning or "").split(",") if p.strip()]
    for r in recs:
        r["resources"] = res_engine.get_resources_for_skill(r["canonical_id"], preferred_types=pref)
        
    categorized = {
        "strong": [g for g in gaps if g["status"] == "STRONG_MATCH"],
        "partial": [g for g in gaps if g["status"] == "PARTIAL_MATCH"],
        "weak": [g for g in gaps if g["status"] == "WEAK"],
        "missing": [g for g in gaps if g["status"] == "MISSING"]
    }
    
    return jsonify({
        "analysis_id": analysis.id,
        "nlp_method_used": analysis.nlp_method_used,
        "student": analysis.student.to_dict(),
        "job": analysis.job.to_dict(),
        "readiness_score": analysis.readiness_score,
        "metrics": {
            "total_skills_analyzed": len(gaps),
            "strong_count": len(categorized["strong"]),
            "partial_count": len(categorized["partial"]),
            "weak_count": len(categorized["weak"]),
            "missing_count": len(categorized["missing"])
        },
        "skills": categorized,
        "all_gaps": gaps,
        "recommendations": recs,
        "top_recommendations": recs[:5],
        "roadmap": roadmap
    }), 200

@analysis_bp.route("/analysis/<int:analysis_id>/skills", methods=["GET"])
def get_analysis_skills(analysis_id):
    analysis = db.session.get(Analysis, analysis_id)
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
    return jsonify({
        "gaps": [g.to_dict() for g in analysis.gaps]
    }), 200

@analysis_bp.route("/analysis/<int:analysis_id>/roadmap", methods=["GET"])
def get_analysis_roadmap(analysis_id):
    analysis = db.session.get(Analysis, analysis_id)
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
    return jsonify({
        "roadmap": [rm.to_dict() for rm in analysis.roadmap_items]
    }), 200
