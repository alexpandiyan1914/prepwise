from datetime import datetime
from backend.extensions import db

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    target_role = db.Column(db.String(120), nullable=False)
    experience_level = db.Column(db.String(50), default='Beginner') # Beginner, Intermediate, Advanced
    daily_prep_hours = db.Column(db.Float, default=3.0)
    preferred_learning = db.Column(db.String(255), default='Practice, Video') # Comma-separated
    assessment_score = db.Column(db.Float, nullable=True)
    resume_filename = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    skills = db.relationship('StudentSkill', backref='student', cascade='all, delete-orphan', lazy=True)
    analyses = db.relationship('Analysis', backref='student', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'target_role': self.target_role,
            'experience_level': self.experience_level,
            'daily_prep_hours': self.daily_prep_hours,
            'preferred_learning': [p.strip() for p in self.preferred_learning.split(',') if p.strip()],
            'assessment_score': self.assessment_score,
            'resume_filename': self.resume_filename,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StudentSkill(db.Model):
    __tablename__ = 'student_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    canonical_id = db.Column(db.String(100), nullable=False)
    proficiency_level = db.Column(db.Integer, default=2) # 1-5
    evidence_text = db.Column(db.Text, nullable=True)
    source = db.Column(db.String(50), default='resume') # resume, self_rated, assessment

    def to_dict(self):
        return {
            'id': self.id,
            'skill_name': self.skill_name,
            'canonical_id': self.canonical_id,
            'proficiency_level': self.proficiency_level,
            'evidence_text': self.evidence_text,
            'source': self.source
        }
