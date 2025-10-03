import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class Config:
    """Configuración base"""
    SECRET_KEY = os.environ.get('JWT_SECRETO') or 'dev-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRETO') or 'jwt-secret-key'
    
    # Base de datos
    DB_HOST = os.environ.get('POSTGRES_HOST', 'db')  # 'db' es el nombre del contenedor
    DB_PORT = os.environ.get('POSTGRES_PORT', '5432')
    DB_NAME = os.environ.get('POSTGRES_DB', 'escuela_db')
    DB_USER = os.environ.get('DB_USUARIO', 'escuela_user')
    DB_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'escuela_password123')
    
    # URL de conexión a la base de datos
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hora

class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Configuración para producción"""
    DEBUG = False
    FLASK_ENV = 'production'

# Configuración por defecto
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'desarrollo': DevelopmentConfig,  # Agregar 'desarrollo' para compatibilidad
    'default': DevelopmentConfig
}

