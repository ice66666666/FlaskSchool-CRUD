from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os
from models import Alumno
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from config import config

# Crear blueprint
auth_bp = Blueprint('auth', __name__)

# Configurar base de datos
config_name = os.environ.get('FLASK_ENV', 'development')
app_config = config[config_name]
engine = create_engine(app_config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint para iniciar sesión"""
    data = request.get_json()
    db = SessionLocal()
    try:
        # Validar campos requeridos
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400
        
        # Buscar alumno por email
        alumno = db.query(Alumno).filter(Alumno.email == data['email']).first()
        
        if not alumno or not check_password_hash(alumno.password_hash, data['password']):
            return jsonify({'error': 'Credenciales inválidas'}), 401
        
        # Generar token JWT
        token = jwt.encode({
            'user_id': alumno.id,
            'email': alumno.email,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, app_config.JWT_SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': alumno.id,
                'nombre': alumno.nombre,
                'apellido': alumno.apellido,
                'email': alumno.email
            },
            'mensaje': 'Login exitoso'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint para registro de alumno"""
    data = request.get_json()
    db = SessionLocal()
    try:
        # Validar campos requeridos
        required_fields = ['nombre', 'apellido', 'email', 'password', 'semestre', 'carrera', 'periodo']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({'error': f'Campos requeridos: {", ".join(missing_fields)}'}), 400
        
        # Verificar si el email ya existe
        existing_alumno = db.query(Alumno).filter(Alumno.email == data['email']).first()
        if existing_alumno:
            return jsonify({'error': 'El email ya está registrado'}), 400
        
        # Crear nuevo alumno con contraseña encriptada
        alumno = Alumno(
            nombre=data['nombre'],
            apellido=data['apellido'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            semestre=data['semestre'],
            carrera=data['carrera'],
            periodo=data['periodo']
        )
        
        db.add(alumno)
        db.commit()
        
        return jsonify({
            'id': alumno.id,
            'mensaje': 'Alumno registrado exitosamente'
        }), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        db.close()
