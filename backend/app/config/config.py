import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "learnsphere-ai-super-secret-jwt-key-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "learnsphere-ai-jwt-secret-key-2026")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///learnsphere.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Supabase Credentials
    SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-supabase-project.supabase.co")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-supabase-anon-key")
    
    # Gemini AI Key
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "demo-gemini-api-key")
