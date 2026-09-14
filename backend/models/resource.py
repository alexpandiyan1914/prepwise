from backend.extensions import db

class Resource(db.Model):
    __tablename__ = 'resources'
    
    id = db.Column(db.Integer, primary_key=True)
    canonical_id = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    provider = db.Column(db.String(150), nullable=False)
    resource_type = db.Column(db.String(50), nullable=False) # Video, Article, Course, Documentation, Practice
    url = db.Column(db.String(500), nullable=False)
    difficulty = db.Column(db.String(50), default='Intermediate')
    estimated_hours = db.Column(db.Float, default=4.0)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'canonical_id': self.canonical_id,
            'title': self.title,
            'provider': self.provider,
            'resource_type': self.resource_type,
            'url': self.url,
            'difficulty': self.difficulty,
            'estimated_hours': self.estimated_hours,
            'description': self.description
        }

class RoadmapItem(db.Model):
    __tablename__ = 'roadmap_items'
    
    id = db.Column(db.Integer, primary_key=True)
    analysis_id = db.Column(db.Integer, db.ForeignKey('analyses.id'), nullable=False)
    day_number = db.Column(db.Integer, nullable=False) # 1 to 5
    title = db.Column(db.String(200), nullable=False)
    canonical_id = db.Column(db.String(100), nullable=False)
    focus_topics = db.Column(db.Text, nullable=False) # comma-separated or json
    action_items = db.Column(db.Text, nullable=False)
    estimated_hours = db.Column(db.Float, default=3.0)
    priority = db.Column(db.String(20), default='HIGH')

    def to_dict(self):
        import json
        try:
            topics = json.loads(self.focus_topics)
        except Exception:
            topics = [t.strip() for t in self.focus_topics.split(',') if t.strip()]
            
        try:
            actions = json.loads(self.action_items)
        except Exception:
            actions = [a.strip() for a in self.action_items.split(';') if a.strip()]
            
        return {
            'id': self.id,
            'day_number': self.day_number,
            'title': self.title,
            'canonical_id': self.canonical_id,
            'focus_topics': topics,
            'action_items': actions,
            'estimated_hours': self.estimated_hours,
            'priority': self.priority
        }
