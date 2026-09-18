import json
import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from flask import Flask
from backend.config import Config
from backend.extensions import db
from backend.models.skill import SkillTaxonomy
from backend.models.resource import Resource

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app

def seed_database():
    app = create_app()
    with app.app_context():
        print('Dropping and creating all database tables...')
        db.create_all()
        
        # 1. Seed Skills
        skills_path = Path(__file__).parent / 'data' / 'skills.json'
        if skills_path.exists():
            with open(skills_path, 'r', encoding='utf-8') as f:
                skills_data = json.load(f)
            
            for item in skills_data:
                existing = SkillTaxonomy.query.get(item['id'])
                if not existing:
                    skill = SkillTaxonomy(
                        id=item['id'],
                        name=item['name'],
                        category=item['category'],
                        aliases=json.dumps(item.get('aliases', [])),
                        description=item.get('description', ''),
                        keywords=json.dumps(item.get('keywords', []))
                    )
                    db.session.add(skill)
            db.session.commit()
            print(f'Seeded {len(skills_data)} skills into taxonomy.')
            
        # 2. Seed Resources
        resources_path = Path(__file__).parent / 'data' / 'resources.json'
        if resources_path.exists():
            with open(resources_path, 'r', encoding='utf-8') as f:
                resources_data = json.load(f)
            
            total_res = 0
            for canonical_id, items in resources_data.items():
                for res in items:
                    existing = Resource.query.filter_by(
                        canonical_id=canonical_id,
                        title=res['title']
                    ).first()
                    if not existing:
                        resource_obj = Resource(
                            canonical_id=canonical_id,
                            title=res['title'],
                            provider=res['provider'],
                            resource_type=res['resource_type'],
                            url=res['url'],
                            difficulty=res.get('difficulty', 'Intermediate'),
                            estimated_hours=res.get('estimated_hours', 4.0),
                            description=res.get('description', '')
                        )
                        db.session.add(resource_obj)
                        total_res += 1
            db.session.commit()
            print(f'Seeded {total_res} resources into library.')
            
        print('Database initialized and seeded successfully!')

if __name__ == '__main__':
    seed_database()
