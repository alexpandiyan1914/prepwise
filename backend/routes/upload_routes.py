import os
import uuid
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from backend.services.resume_parser import ResumeParser
from backend.services.jd_parser import JobDescriptionParser
from backend.services.skill_extractor import SkillExtractor

upload_bp = Blueprint("upload", __name__, url_prefix="/api")

def allowed_file(filename: str) -> bool:
    allowed = current_app.config.get("ALLOWED_EXTENSIONS", {"pdf", "docx", "txt"})
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed

@upload_bp.route("/upload/resume", methods=["POST"])
def upload_resume():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in request"}), 400
            
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
            
        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported file type. Please upload a PDF, DOCX, or TXT file."}), 400
            
        upload_dir = Path(current_app.config["UPLOAD_FOLDER"])
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        safe_name = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex[:8]}_{safe_name}"
        save_path = upload_dir / unique_filename
        file.save(str(save_path))
        
        # Parse content
        parsed = ResumeParser.parse(file_path=str(save_path))
        extractor = SkillExtractor()
        extracted_skills = extractor.extract_skills_from_text(parsed["full_text"], source_type="resume")
        
        return jsonify({
            "message": "Resume uploaded and parsed successfully",
            "filename": unique_filename,
            "original_name": safe_name,
            "candidate_name": parsed.get("candidate_name"),
            "email": parsed.get("email"),
            "skills_detected": len(extracted_skills),
            "skills": extracted_skills,
            "full_text_length": len(parsed["full_text"])
        }), 200
        
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to process resume: {str(e)}"}), 500

@upload_bp.route("/upload/jd", methods=["POST"])
def upload_jd():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in request"}), 400
            
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
            
        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported file type. Please upload a PDF, DOCX, or TXT file."}), 400
            
        upload_dir = Path(current_app.config["UPLOAD_FOLDER"])
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        safe_name = secure_filename(file.filename)
        unique_filename = f"jd_{uuid.uuid4().hex[:8]}_{safe_name}"
        save_path = upload_dir / unique_filename
        file.save(str(save_path))
        
        company = request.form.get("company_name", "")
        role = request.form.get("target_role", "")
        
        parsed = JobDescriptionParser.parse(file_path=str(save_path), company=company, role=role)
        extractor = SkillExtractor()
        required_skills = extractor.extract_skills_from_text(parsed["required_text"] or parsed["full_text"], source_type="jd_required")
        preferred_skills = extractor.extract_skills_from_text(parsed["preferred_text"], source_type="jd_preferred")
        
        # Mark flags
        for s in required_skills:
            s["is_required"] = True
        for s in preferred_skills:
            s["is_required"] = False
            
        return jsonify({
            "message": "Job description uploaded and analyzed",
            "filename": unique_filename,
            "company": parsed["company"],
            "role": parsed["role"],
            "required_skills": required_skills,
            "preferred_skills": preferred_skills,
            "full_text": parsed["full_text"]
        }), 200
        
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to process job description: {str(e)}"}), 500

@upload_bp.route("/jd/text", methods=["POST"])
def submit_jd_text():
    try:
        data = request.get_json() or {}
        text = data.get("text", "").strip()
        company = data.get("company_name", "").strip() or "Target Tech Corp"
        role = data.get("target_role", "").strip() or "Software Development Engineer"
        
        if not text:
            return jsonify({"error": "Job description text cannot be empty"}), 400
            
        parsed = JobDescriptionParser.parse(raw_text=text, company=company, role=role)
        extractor = SkillExtractor()
        
        req_text = parsed["required_text"] or text
        pref_text = parsed["preferred_text"]
        
        required_skills = extractor.extract_skills_from_text(req_text, source_type="jd_required")
        preferred_skills = extractor.extract_skills_from_text(pref_text, source_type="jd_preferred") if pref_text else []
        
        for s in required_skills:
            s["is_required"] = True
        for s in preferred_skills:
            s["is_required"] = False
            
        return jsonify({
            "message": "Job description text processed successfully",
            "company": company,
            "role": role,
            "required_skills": required_skills,
            "preferred_skills": preferred_skills,
            "text_length": len(text)
        }), 200
        
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to process job description: {str(e)}"}), 500
