from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime

# Importar Base del __init__.py
from . import Base

class Profesor(Base):
    __tablename__ = 'profesores'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    especialidad = Column(String(50), nullable=False)
    departamento = Column(String(50), nullable=False)
    telefono = Column(String(20))
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Profesor {self.email}>'