import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from flask import Flask, jsonify
from backend.config import Config
from backend.extensions import db, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from backend.routes.profile_routes import profile_bp
    from backend.routes.upload_routes import upload_bp
    from backend.routes.analysis_routes import analysis_bp
    from backend.routes.recommendation_routes import recommendation_bp
    from backend.routes.resource_routes import resource_bp
    from backend.routes.demo_routes import demo_bp

    app.register_blueprint(profile_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(resource_bp)
    app.register_blueprint(demo_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "PrepWise Recommendation API",
            "version": "1.0.0"
        }), 200

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": str(e.description if hasattr(e, "description") else "Bad request")}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "An internal server error occurred"}), 500

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print(f"PrepWise API running on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
