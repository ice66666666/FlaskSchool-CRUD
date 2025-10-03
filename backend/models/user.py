from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime

# Importar Base del __init__.py
from . import Base

class Alumno(Base):
    __tablename__ = 'alumnos'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    carrera = Column(String(100), nullable=False)
    semestre = Column(Integer, nullable=False)
    periodo = Column(String(50), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Alumno {self.email}>'