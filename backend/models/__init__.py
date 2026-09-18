from backend.extensions import db
from backend.models.student import Student, StudentSkill
from backend.models.job import Job, JobSkill
from backend.models.skill import SkillTaxonomy
from backend.models.recommendation import Analysis, SkillGap, Recommendation
from backend.models.resource import Resource, RoadmapItem

__all__ = [
    'db',
    'Student', 'StudentSkill',
    'Job', 'JobSkill',
    'SkillTaxonomy',
    'Analysis', 'SkillGap', 'Recommendation',
    'Resource', 'RoadmapItem'
]
