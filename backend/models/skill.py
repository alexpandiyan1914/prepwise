from backend.extensions import db

class SkillTaxonomy(db.Model):
    __tablename__ = 'skill_taxonomy'
    
    id = db.Column(db.String(100), primary_key=True) # canonical id e.g. 'dsa'
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    aliases = db.Column(db.Text, nullable=False) # JSON array of aliases
    description = db.Column(db.Text, nullable=True)
    keywords = db.Column(db.Text, nullable=True) # JSON array of keywords

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'aliases': json.loads(self.aliases) if self.aliases else [],
            'description': self.description,
            'keywords': json.loads(self.keywords) if self.keywords else []
        }
