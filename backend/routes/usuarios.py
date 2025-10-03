from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models import Alumno
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from config import config
import os

# Crear blueprint
alumnos_bp = Blueprint('alumnos', __name__)

# Configurar base de datos
config_name = os.environ.get('FLASK_ENV', 'development')
app_config = config[config_name]
engine = create_engine(app_config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#"""Obtener todos los alumnos"""
@alumnos_bp.route('/alumnos', methods=['GET'])
def get_alumnos():
    db = SessionLocal()
    try:
        alumnos = db.query(Alumno).all()
        return jsonify([{
            "id": alumno.id,
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "email": alumno.email,
            "semestre": alumno.semestre,
            "carrera": alumno.carrera,
            "periodo": alumno.periodo,
            "fecha_creacion": alumno.fecha_creacion.isoformat()
        } for alumno in alumnos])
    finally:
        db.close()

#"""Obtener un alumno por ID"""
@alumnos_bp.route('/alumnos/<int:alumno_id>', methods=['GET'])
def get_alumno(alumno_id):
    """Obtener un alumno por ID"""
    db = SessionLocal()
    try:
        alumno = db.query(Alumno).filter(Alumno.id == alumno_id).first()
        if not alumno:
            return jsonify({"error": "Alumno no encontrado"}), 404
        return jsonify({
            "id": alumno.id,
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "email": alumno.email,
            "semestre": alumno.semestre,
            "carrera": alumno.carrera,
            "periodo": alumno.periodo,
            "fecha_creacion": alumno.fecha_creacion.isoformat()
        })
    finally:
        db.close()

#
@alumnos_bp.route('/alumnos', methods=['POST'])
def create_alumno():
    """Crear un nuevo alumno"""
    data = request.get_json()
    db = SessionLocal()
    try:
        # Verificar si el email ya existe
        if data.get('email'):
            existing_user = db.query(Alumno).filter(Alumno.email == data['email']).first()
            if existing_user:
                return jsonify({'error': 'El email ya está registrado'}), 400
        
        alumno = Alumno(
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data.get('email', ''),
            password_hash=generate_password_hash(data.get('password', 'defaultpassword')),
            semestre=data['semestre'],
            carrera=data['carrera'],
            periodo=data['periodo']
        )
        db.add(alumno)
        db.commit()
        return jsonify({'id': alumno.id, 'mensaje': 'Alumno creado exitosamente'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()

#"""Actualizar un alumno"""
@alumnos_bp.route('/alumnos/<int:alumno_id>', methods=['PUT'])
def update_alumno(alumno_id):
    """Actualizar un alumno"""
    data = request.get_json()
    db = SessionLocal()
    try:
        alumno = db.query(Alumno).filter(Alumno.id == alumno_id).first()
        if not alumno:
            return jsonify({'error': 'Alumno no encontrado'}), 404
        
        alumno.nombre = data.get('nombre', alumno.nombre)
        alumno.apellido = data.get('apellido', alumno.apellido)
        alumno.semestre = data.get('semestre', alumno.semestre)
        alumno.carrera = data.get('carrera', alumno.carrera)
        alumno.periodo = data.get('periodo', alumno.periodo)
        
        db.commit()
        return jsonify({'mensaje': 'Alumno actualizado exitosamente'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()

#"""Eliminar un alumno"""
@alumnos_bp.route('/alumnos/<int:alumno_id>', methods=['DELETE'])
def delete_alumno(alumno_id):
    """Eliminar un alumno"""
    db = SessionLocal()
    try:
        alumno = db.query(Alumno).filter(Alumno.id == alumno_id).first()
        if not alumno:
            return jsonify({'error': 'Alumno no encontrado'}), 404
        
        db.delete(alumno)
        db.commit()
        return jsonify({'mensaje': 'Alumno eliminado exitosamente'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()