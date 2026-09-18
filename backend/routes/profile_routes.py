from flask import Blueprint, request, jsonify
from backend.extensions import db
from backend.models.student import Student

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

@profile_bp.route("", methods=["POST"])
def save_profile():
    try:
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        target_role = data.get("target_role", "").strip()
        
        if not name:
            return jsonify({"error": "Student name is required"}), 400
        if not target_role:
            return jsonify({"error": "Target role is required"}), 400
            
        student_id = data.get("student_id")
        student = None
        if student_id:
            student = db.session.get(Student, student_id)
            
        if not student:
            student = Student(
                name=name,
                target_role=target_role,
                experience_level=data.get("experience_level", "Beginner"),
                daily_prep_hours=float(data.get("daily_prep_hours", 3.0)),
                preferred_learning=",".join(data.get("preferred_learning", ["Practice", "Video"])),
                assessment_score=data.get("assessment_score")
            )
            db.session.add(student)
        else:
            student.name = name
            student.target_role = target_role
            student.experience_level = data.get("experience_level", student.experience_level)
            student.daily_prep_hours = float(data.get("daily_prep_hours", student.daily_prep_hours))
            student.preferred_learning = ",".join(data.get("preferred_learning", [])) if data.get("preferred_learning") else student.preferred_learning
            student.assessment_score = data.get("assessment_score", student.assessment_score)
            
        db.session.commit()
        return jsonify({
            "message": "Profile saved successfully",
            "student": student.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save profile: {str(e)}"}), 500

@profile_bp.route("", methods=["GET"])
def get_profile():
    student = Student.query.order_by(Student.id.desc()).first()
    if not student:
        return jsonify({"student": None}), 200
    return jsonify({"student": student.to_dict()}), 200
