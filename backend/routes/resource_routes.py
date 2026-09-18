from flask import Blueprint, jsonify, request
from backend.services.resource_engine import ResourceEngine
from backend.models.resource import Resource

resource_bp = Blueprint("resource", __name__, url_prefix="/api/resources")

@resource_bp.route("/<canonical_id>", methods=["GET"])
def get_resources_by_skill(canonical_id):
    pref_str = request.args.get("preferred", "")
    pref_types = [p.strip() for p in pref_str.split(",") if p.strip()]
    
    engine = ResourceEngine()
    resources = engine.get_resources_for_skill(canonical_id, preferred_types=pref_types)
    return jsonify({
        "canonical_id": canonical_id,
        "resources": resources
    }), 200

@resource_bp.route("", methods=["GET"])
def get_all_resources():
    all_res = Resource.query.all()
    return jsonify({
        "count": len(all_res),
        "resources": [r.to_dict() for r in all_res]
    }), 200
