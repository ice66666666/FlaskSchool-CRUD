from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime

# Importar Base del __init__.py
from . import Base

class Institucion(Base):
    __tablename__ = 'instituciones'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    direccion = Column(String(200), nullable=False)
    telefono = Column(String(20), nullable=False)
    email = Column(String(120))
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Institucion {self.nombre}>'