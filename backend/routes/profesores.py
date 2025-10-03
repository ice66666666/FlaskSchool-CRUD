from flask import Blueprint, request, jsonify
from models import Profesor
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from config import config
import os

# Crear blueprint
profesores_bp = Blueprint('profesores', __name__)

# Configurar base de datos
config_name = os.environ.get('FLASK_ENV', 'development')
app_config = config[config_name]
engine = create_engine(app_config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#"""Obtener todos los profesores"""
@profesores_bp.route('/profesores', methods=['GET'])
def get_profesores():
    db = SessionLocal()
    try:
        profesores = db.query(Profesor).all()
        return jsonify([{
            'id': p.id,
            'nombre': p.nombre,
            'apellido': p.apellido,
            'email': p.email,
            'especialidad': p.especialidad,
            'departamento': p.departamento,
            'telefono': p.telefono,
            'fecha_creacion': p.fecha_creacion.isoformat()
        } for p in profesores])
    finally:
        db.close()

#"""Obtener un profesor por ID"""
@profesores_bp.route('/profesores/<int:profesor_id>', methods=['GET'])
def get_profesor(profesor_id):
    """Obtener un profesor por ID"""
    db = SessionLocal()
    try:
        profesor = db.query(Profesor).filter(Profesor.id == profesor_id).first()
        if not profesor:
            return jsonify({'error': 'Profesor no encontrado'}), 404
        return jsonify({
            'id': profesor.id,
            'nombre': profesor.nombre,
            'apellido': profesor.apellido,
            'email': profesor.email,
            'especialidad': profesor.especialidad,
            'departamento': profesor.departamento,
            'telefono': profesor.telefono,
            'fecha_creacion': profesor.fecha_creacion.isoformat()
        })
    finally:
        db.close()

#"""Crear un nuevo profesor"""
@profesores_bp.route('/profesores', methods=['POST'])
def create_profesor():
    """Crear un nuevo profesor"""
    data = request.get_json()
    db = SessionLocal()
    try:
        profesor = Profesor(
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data['email'],
            especialidad=data['especialidad'],
            departamento=data['departamento'],
            telefono=data.get('telefono')
        )
        db.add(profesor)
        db.commit()
        return jsonify({'id': profesor.id, 'mensaje': 'Profesor creado exitosamente'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()

#"""Actualizar un profesor"""
@profesores_bp.route('/profesores/<int:profesor_id>', methods=['PUT'])
def update_profesor(profesor_id):
    """Actualizar un profesor"""
    data = request.get_json()
    db = SessionLocal()
    try:
        profesor = db.query(Profesor).filter(Profesor.id == profesor_id).first()
        if not profesor:
            return jsonify({'error': 'Profesor no encontrado'}), 404
        
        profesor.nombre = data.get('nombre', profesor.nombre)
        profesor.apellido = data.get('apellido', profesor.apellido)
        profesor.email = data.get('email', profesor.email)
        profesor.especialidad = data.get('especialidad', profesor.especialidad)
        profesor.departamento = data.get('departamento', profesor.departamento)
        profesor.telefono = data.get('telefono', profesor.telefono)
        
        db.commit()
        return jsonify({'mensaje': 'Profesor actualizado exitosamente'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()

#"""Eliminar un profesor"""
@profesores_bp.route('/profesores/<int:profesor_id>', methods=['DELETE'])
def delete_profesor(profesor_id):
    """Eliminar un profesor"""
    db = SessionLocal()
    try:
        profesor = db.query(Profesor).filter(Profesor.id == profesor_id).first()
        if not profesor:
            return jsonify({'error': 'Profesor no encontrado'}), 404
        
        db.delete(profesor)
        db.commit()
        return jsonify({'mensaje': 'Profesor eliminado exitosamente'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()