# Routes package initialization
from flask import Blueprint

# Importar todos los blueprints
from .auth import auth_bp
from .usuarios import alumnos_bp
from .profesores import profesores_bp
from .instituciones import instituciones_bp

# Exportar todos los blueprints
__all__ = ['auth_bp', 'alumnos_bp', 'profesores_bp', 'instituciones_bp']
