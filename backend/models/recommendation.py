from datetime import datetime
from backend.extensions import db

class Analysis(db.Model):
    __tablename__ = 'analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    readiness_score = db.Column(db.Float, nullable=False, default=0.0) # 0-100
    nlp_method_used = db.Column(db.String(100), default='Taxonomy & Semantic Vectors')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    gaps = db.relationship('SkillGap', backref='analysis', cascade='all, delete-orphan', lazy=True)
    recommendations = db.relationship('Recommendation', backref='analysis', cascade='all, delete-orphan', lazy=True)
    roadmap_items = db.relationship('RoadmapItem', backref='analysis', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'job_id': self.job_id,
            'readiness_score': round(self.readiness_score, 1),
            'nlp_method_used': self.nlp_method_used,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class SkillGap(db.Model):
    __tablename__ = 'skill_gaps'
    
    id = db.Column(db.Integer, primary_key=True)
    analysis_id = db.Column(db.Integer, db.ForeignKey('analyses.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    canonical_id = db.Column(db.String(100), nullable=False)
    is_required = db.Column(db.Boolean, default=True)
    student_level = db.Column(db.Integer, default=0) # 0-5
    required_level = db.Column(db.Integer, default=4) # 1-5
    similarity_score = db.Column(db.Float, default=0.0) # 0.0 - 1.0
    gap_score = db.Column(db.Float, default=1.0) # 0.0 - 1.0
    status = db.Column(db.String(50), nullable=False) # STRONG_MATCH, PARTIAL_MATCH, WEAK, MISSING
    student_evidence = db.Column(db.Text, nullable=True)
    jd_requirement = db.Column(db.Text, nullable=True)
    explanation = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'skill_name': self.skill_name,
            'canonical_id': self.canonical_id,
            'is_required': self.is_required,
            'student_level': self.student_level,
            'required_level': self.required_level,
            'similarity_score': round(self.similarity_score, 2),
            'gap_score': round(self.gap_score, 2),
            'status': self.status,
            'student_evidence': self.student_evidence,
            'jd_requirement': self.jd_requirement,
            'explanation': self.explanation
        }

class Recommendation(db.Model):
    __tablename__ = 'recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    analysis_id = db.Column(db.Integer, db.ForeignKey('analyses.id'), nullable=False)
    rank = db.Column(db.Integer, nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    canonical_id = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(20), nullable=False) # VERY HIGH, HIGH, MEDIUM, LOW
    score = db.Column(db.Float, nullable=False) # 0-100
    gap_level = db.Column(db.String(50), nullable=False)
    jd_relevance = db.Column(db.Float, default=0.0) # 0-100
    skill_gap_factor = db.Column(db.Float, default=0.0) # 0-100
    role_importance = db.Column(db.Float, default=0.0) # 0-100
    prerequisite_readiness = db.Column(db.Float, default=0.0) # 0-100
    user_preference = db.Column(db.Float, default=0.0) # 0-100
    learning_history = db.Column(db.Float, default=50.0) # 0-100
    why_recommended = db.Column(db.Text, nullable=False)
    action_plan = db.Column(db.Text, nullable=False)
    estimated_hours = db.Column(db.Float, default=8.0)
    prerequisite_status = db.Column(db.String(100), default='Ready')
    prerequisite_notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'rank': self.rank,
            'skill_name': self.skill_name,
            'canonical_id': self.canonical_id,
            'priority': self.priority,
            'score': round(self.score, 1),
            'gap_level': self.gap_level,
            'factors': {
                'jd_relevance': round(self.jd_relevance, 1),
                'skill_gap': round(self.skill_gap_factor, 1),
                'role_importance': round(self.role_importance, 1),
                'readiness': round(self.prerequisite_readiness, 1),
                'preference': round(self.user_preference, 1),
                'learning_history': round(self.learning_history, 1)
            },
            'why_recommended': self.why_recommended,
            'action_plan': self.action_plan,
            'estimated_hours': self.estimated_hours,
            'prerequisite_status': self.prerequisite_status,
            'prerequisite_notes': self.prerequisite_notes
        }
