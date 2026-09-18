from flask import Blueprint, jsonify
from backend.extensions import db
from backend.models.recommendation import Analysis, Recommendation
from backend.services.resource_engine import ResourceEngine

recommendation_bp = Blueprint("recommendation", __name__, url_prefix="/api")

@recommendation_bp.route("/analysis/<int:analysis_id>/recommendations", methods=["GET"])
def get_recommendations(analysis_id):
    analysis = db.session.get(Analysis, analysis_id)
    if not analysis:
        return jsonify({"error": "Analysis not found"}), 404
        
    recs = [r.to_dict() for r in analysis.recommendations]
    res_engine = ResourceEngine()
    pref = [p.strip() for p in (analysis.student.preferred_learning or "").split(",") if p.strip()]
    
    for r in recs:
        r["resources"] = res_engine.get_resources_for_skill(r["canonical_id"], preferred_types=pref)
        
    return jsonify({
        "analysis_id": analysis_id,
        "recommendations": recs,
        "top_5": recs[:5]
    }), 200
