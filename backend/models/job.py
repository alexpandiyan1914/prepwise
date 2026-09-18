from datetime import datetime
from backend.extensions import db

class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(150), nullable=False)
    role_title = db.Column(db.String(150), nullable=False)
    raw_text = db.Column(db.Text, nullable=True)
    filename = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    skills = db.relationship('JobSkill', backref='job', cascade='all, delete-orphan', lazy=True)
    analyses = db.relationship('Analysis', backref='job', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'role_title': self.role_title,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'skills_count': len(self.skills)
        }

class JobSkill(db.Model):
    __tablename__ = 'job_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    canonical_id = db.Column(db.String(100), nullable=False)
    is_required = db.Column(db.Boolean, default=True) # True = Required, False = Preferred
    required_proficiency = db.Column(db.Integer, default=4) # 1-5
    context_snippet = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'skill_name': self.skill_name,
            'canonical_id': self.canonical_id,
            'is_required': self.is_required,
            'required_proficiency': self.required_proficiency,
            'context_snippet': self.context_snippet
        }
