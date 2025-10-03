# Models package initialization
from sqlalchemy.ext.declarative import declarative_base

# Crear Base única para todos los modelos
Base = declarative_base()

# Importar todos los modelos
from .user import Alumno
from .profesor import Profesor
from .institucion import Institucion

# Exportar todo lo necesario
__all__ = ['Base', 'Alumno', 'Profesor', 'Institucion']