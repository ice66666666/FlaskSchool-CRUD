# Script para generar datos de prueba
import requests
import json
import random
from datetime import datetime, timedelta

# URLs de la API
BASE_URL = "http://localhost:5000"

# Datos de prueba para usuarios
usuarios_prueba = [
    {
        "nombre": "María",
        "apellido": "Gonzalez",
        "email": "maria.gonzalez@email.com",
        "password": "password123",
        "semestre": 3,
        "carrera": "Ingeniería en Sistemas",
        "periodo": "Enero-Mayo 2025"
    },
    {
        "nombre": "Juan",
        "apellido": "Rodriguez",
        "email": "juan.rodriguez@email.com",
        "password": "password123",
        "semestre": 5,
        "carrera": "Administración",
        "periodo": "Enero-Mayo 2025"
    },
    {
        "nombre": "Ana",
        "apellido": "Lopez",
        "email": "ana.lopez@email.com",
        "password": "password123",
        "semestre": 2,
        "carrera": "Contabilidad",
        "periodo": "Enero-Mayo 2025"
    },
    {
        "nombre": "Carlos",
        "apellido": "Mendez",
        "email": "carlos.mendez@email.com",
        "password": "password123",
        "semestre": 6,
        "carrera": "Psicología",
        "periodo": "Enero-Mayo 2025"
    },
    {
        "nombre": "Laura",
        "apellido": "Martinez",
        "email": "laura.martinez@email.com",
        "password": "password123",
        "semestre": 4,
        "carrera": "Medicina",
        "periodo": "Enero-Mayo 2025"
    }
]

# Datos de prueba para profesores
profesores_prueba = [
    {
        "nombre": "Dr. Roberto",
        "apellido": "Garcia",
        "email": "roberto.garcia@univ.edu",
        "especialidad": "Matemáticas Avanzadas",
        "departamento": "Ciencias Aplicadas"
    },
    {
        "nombre": "Dra. Carmen",
        "apellido": "Herrera",
        "email": "carmen.herrera@univ.edu",
        "especialidad": "Programación",
        "departamento": "Ingeniería en Sistemas"
    },
    {
        "nombre": "Dr. Luis",
        "apellido": "Vargas",
        "email": "luis.vargas@univ.edu",
        "especialidad": "Contabilidad",
        "departamento": "Administración"
    }
]

# Datos de prueba para instituciones
instituciones_prueba = [
    {
        "nombre": "Universidad Tecnológica de México",
        "direccion": "Av. Tecnología 123, Ciudad de México",
        "telefono": "+52 55 1234 5678",
        "email": "info@utm.edu.mx",
        "director": "Ing. Miguel Sanchez",
        "tipo": "Universidad"
    },
    {
        "nombre": "Instituto Politécnico Nacional",
        "direccion": "Av. Instituto 456, CDMX",
        "telefono": "+52 55 8765 4321",
        "email": "contacto@ipn.edu.mx",
        "director": "Dr. Patricia Flores",
        "tipo": "Instituto"
    },
    {
        "nombre": "Universidad Nacional Autónoma de México",
        "direccion": "Av. Universidad 789, Coyoacán",
        "telefono": "+52 55 3210 9876",
        "email": "admision@unam.edu.mx",
        "director": "Dr. Alberto Morales",
        "tipo": "Universidad"
    }
]

def crear_usuario(usuario):
    """Crear un usuario en el sistema"""
    try:
        response = requests.post(f"{BASE_URL}/register", 
                               json=usuario,
                               headers={"Content-Type": "application/json"})
        if response.status_code == 201:
            print(f"✅ Usuario creado: {usuario['nombre']} {usuario['apellido']}")
            return True
        else:
            print(f"❌ Error creando usuario {usuario['nombre']}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error conectando: {e}")
        return False

def crear_profesor(profesor):
    """Crear un profesor en el sistema"""
    try:
        response = requests.post(f"{BASE_URL}/profesores",
                               json=profesor,
                               headers={"Content-Type": "application/json"})
        if response.status_code == 201:
            print(f"✅ Profesor creado: {profesor['nombre']} {profesor['apellido']}")
            return True
        else:
            print(f"❌ Error creando profesor {profesor['nombre']}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error conectando: {e}")
        return False

def crear_institucion(institucion):
    """Crear una institución en el sistema"""
    try:
        response = requests.post(f"{BASE_URL}/instituciones",
                               json=institucion,
                               headers={"Content-Type": "application/json"})
        if response.status_code == 201:
            print(f"✅ Institución creada: {institucion['nombre']}")
            return True
        else:
            print(f"❌ Error creando institución {institucion['nombre']}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error conectando: {e}")
        return False

def verificar_servidor():
    """Verificar que el servidor esté corriendo"""
    try:
        response = requests.get(f"{BASE_URL}/usuarios")
        print("✅ Servidor respondiendo correctamente")
        return True
    except Exception as e:
        print(f"❌ Servidor no disponible: {e}")
        print("Asegúrate de que los servicios estén corriendo: docker-compose up -d")
        return False

def main():
    print("🚀 Iniciando creación de datos de prueba...")
    print("=" * 50)
    
    # Verificar servidor
    if not verificar_servidor():
        return
    
    # Crear usuarios
    print("\n👥 Creando usuarios de prueba...")
    usuarios_creados = 0
    for usuario in usuarios_prueba:
        if crear_usuario(usuario):
            usuarios_creados += 1
    
    # Crear profesores
    print("\n👨‍🏫 Creando profesores de prueba...")
    profesores_creados = 0
    for profesor in profesores_prueba:
        if crear_profesor(profesor):
            profesores_creados += 1
    
    # Crear instituciones
    print("\n🏫 Creando instituciones de prueba...")
    instituciones_creadas = 0
    for institucion in instituciones_prueba:
        if crear_institucion(institucion):
            instituciones_creadas += 1
    
    # Resumen
    print("\n" + "=" * 50)
    print("📊 RESUMEN DE DATOS CREADOS:")
    print(f"✅ Usuarios: {usuarios_creados}/{len(usuarios_prueba)}")
    print(f"✅ Profesores: {profesores_creados}/{len(profesores_prueba)}")
    print(f"✅ Instituciones: {instituciones_creadas}/{len(instituciones_prueba)}")
    print("\n🌐 Dashboard disponible en: http://localhost:3000")
    print("🔧 API disponible en: http://localhost:5000")

if __name__ == "__main__":
    main()
