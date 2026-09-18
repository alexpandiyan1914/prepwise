import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'prepwise-dev-secret-key-2026')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'sqlite:///{BASE_DIR}/prepwise.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Uploads
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', str(BASE_DIR / 'uploads'))
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
    
    # Thresholds
    SIMILARITY_STRONG = 0.80
    SIMILARITY_PARTIAL = 0.60
    SIMILARITY_WEAK = 0.40
    
    # Priority Score Thresholds (0-100)
    PRIORITY_VERY_HIGH = 80
    PRIORITY_HIGH = 65
    PRIORITY_MEDIUM = 45
    
    # NLP Model Config
    NLP_MODEL_NAME = os.environ.get('NLP_MODEL_NAME', 'all-MiniLM-L6-v2')
