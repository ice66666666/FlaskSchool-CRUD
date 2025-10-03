from flask import Blueprint, request, jsonify
from models import Institucion
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from config import config
import os

# Crear blueprint
instituciones_bp = Blueprint('instituciones', __name__)

# Configurar base de datos
config_name = os.environ.get('FLASK_ENV', 'development')
app_config = config[config_name]
engine = create_engine(app_config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#"""Obtener todas las instituciones"""
@instituciones_bp.route('/instituciones', methods=['GET'])
def get_instituciones():
    db = SessionLocal()
    try:
        instituciones = db.query(Institucion).all()
        return jsonify([{
            'id': i.id,
            'nombre': i.nombre,
            'direccion': i.direccion,
            'telefono': i.telefono,
            'email': i.email,
            'fecha_creacion': i.fecha_creacion.isoformat()
        } for i in instituciones])
    finally:
        db.close()

#"""Obtener una institución por ID"""
@instituciones_bp.route('/instituciones/<int:institucion_id>', methods=['GET'])
def get_institucion(institucion_id):
    """Obtener una institución por ID"""
    db = SessionLocal()
    try:
        institucion = db.query(Institucion).filter(Institucion.id == institucion_id).first()
        if not institucion:
            return jsonify({'error': 'Institución no encontrada'}), 404
        return jsonify({
            'id': institucion.id,
            'nombre': institucion.nombre,
            'direccion': institucion.direccion,
            'telefono': institucion.telefono,
            'email': institucion.email,
            'fecha_creacion': institucion.fecha_creacion.isoformat()
        })
    finally:
        db.close()

#"""Crear una nueva institución"""
@instituciones_bp.route('/instituciones', methods=['POST'])
def create_institucion():
    """Crear una nueva institución"""
    data = request.get_json()
    db = SessionLocal()
    try:
        institucion = Institucion(
            nombre=data['nombre'],
            direccion=data['direccion'],
            telefono=data['telefono'],
            email=data.get('email')
        )
        db.add(institucion)
        db.commit()
        return jsonify({'id': institucion.id, 'mensaje': 'Institución creada exitosamente'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()

#"""Actualizar una institución"""
@instituciones_bp.route('/instituciones/<int:institucion_id>', methods=['PUT'])
def update_institucion(institucion_id):
    """Actualizar una institución"""
    data = request.get_json()
    db = SessionLocal()
    try:
        institucion = db.query(Institucion).filter(Institucion.id == institucion_id).first()
        if not institucion:
            return jsonify({'error': 'Institución no encontrada'}), 404
        
        institucion.nombre = data.get('nombre', institucion.nombre)
        institucion.direccion = data.get('direccion', institucion.direccion)
        institucion.telefono = data.get('telefono', institucion.telefono)
        institucion.email = data.get('email', institucion.email)
        
        db.commit()
        return jsonify({'mensaje': 'Institución actualizada exitosamente'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()

#"""Eliminar una institución"""
@instituciones_bp.route('/instituciones/<int:institucion_id>', methods=['DELETE'])
def delete_institucion(institucion_id):
    """Eliminar una institución"""
    db = SessionLocal()
    try:
        institucion = db.query(Institucion).filter(Institucion.id == institucion_id).first()
        if not institucion:
            return jsonify({'error': 'Institución no encontrada'}), 404
        
        db.delete(institucion)
        db.commit()
        return jsonify({'mensaje': 'Institución eliminada exitosamente'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()