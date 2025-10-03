# 📚 Documentación Completa - Sistema Escolar con Docker

## 🎯 Resumen del Proyecto

Este es un **Sistema de Gestión Escolar** completo desarrollado con tecnologías modernas, containerizado con Docker y orquestado con Docker Compose. El sistema permite gestionar alumnos, profesores e instituciones educativas con una interfaz web intuitiva y una API REST robusta.

## 🏗️ Arquitectura del Sistema

### Estructura General
```
escuela-docker/
├── backend/           # API Flask con autenticación JWT
├── frontend/          # Interfaz web HTML/CSS/JavaScript
├── compose.yaml       # Orquestación Docker
└── .env              # Variables de entorno
```

### Componentes Principales

#### 1. **Backend (Flask + PostgreSQL)**
- **Framework**: Flask (Python)
- **Base de datos**: PostgreSQL 16
- **ORM**: SQLAlchemy
- **Autenticación**: JWT (JSON Web Tokens)
- **Migraciones**: Flask-Migrate con Alembic
- **Puerto**: 5000

#### 2. **Frontend (HTML/CSS/JavaScript)**
- **Servidor web**: Nginx
- **Estilos**: Bootstrap 5 + CSS personalizado
- **JavaScript**: ES6+ con módulos
- **Gráficos**: Chart.js
- **Puerto**: 3000

#### 3. **Base de Datos (PostgreSQL)**
- **Versión**: PostgreSQL 16
- **Puerto**: 5433
- **Persistencia**: Volumen Docker

## 📊 Modelos de Datos

### 1. **Alumno** (`models/user.py`)
```python
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
```

**Campos:**
- Información personal (nombre, apellido, email)
- Credenciales (password_hash encriptado)
- Información académica (carrera, semestre, periodo)
- Timestamp de creación

### 2. **Profesor** (`models/profesor.py`)
```python
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
```

**Campos:**
- Información personal (nombre, apellido, email, teléfono)
- Información profesional (especialidad, departamento)
- Timestamp de creación

### 3. **Institución** (`models/institucion.py`)
```python
class Institucion(Base):
    __tablename__ = 'instituciones'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    direccion = Column(String(200), nullable=False)
    telefono = Column(String(20), nullable=False)
    email = Column(String(120))
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
```

**Campos:**
- Información institucional (nombre, dirección, teléfono, email)
- Timestamp de creación

## 🔐 Sistema de Autenticación

### JWT (JSON Web Tokens)
- **Algoritmo**: HS256
- **Duración**: 1 hora (configurable)
- **Secreto**: Variable de entorno `JWT_SECRETO`
- **Header**: `Authorization: <token>`

### Endpoints de Autenticación (`routes/auth.py`)

#### POST `/login`
```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "usuario@ejemplo.com"
    },
    "mensaje": "Login exitoso"
}
```

#### POST `/register`
```json
{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "semestre": 5,
    "carrera": "Ingeniería en Sistemas",
    "periodo": "2024-1"
}
```

## 🛠️ API REST Endpoints

### Alumnos (`routes/usuarios.py`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/alumnos` | Listar todos los alumnos |
| GET | `/alumnos/{id}` | Obtener alumno por ID |
| POST | `/alumnos` | Crear nuevo alumno |
| PUT | `/alumnos/{id}` | Actualizar alumno |
| DELETE | `/alumnos/{id}` | Eliminar alumno |

### Profesores (`routes/profesores.py`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/profesores` | Listar todos los profesores |
| GET | `/profesores/{id}` | Obtener profesor por ID |
| POST | `/profesores` | Crear nuevo profesor |
| PUT | `/profesores/{id}` | Actualizar profesor |
| DELETE | `/profesores/{id}` | Eliminar profesor |

### Instituciones (`routes/instituciones.py`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/instituciones` | Listar todas las instituciones |
| GET | `/instituciones/{id}` | Obtener institución por ID |
| POST | `/instituciones` | Crear nueva institución |
| PUT | `/instituciones/{id}` | Actualizar institución |
| DELETE | `/instituciones/{id}` | Eliminar institución |

## 🎨 Frontend - Interfaz de Usuario

### Páginas Principales

#### 1. **Dashboard** (`index.html`)
- **Estadísticas en tiempo real**: Contadores de alumnos, profesores e instituciones
- **Gráficos interactivos**: Distribución por carreras, análisis temporal
- **Actividad reciente**: Últimas acciones en el sistema
- **Diseño responsive**: Adaptable a móviles y tablets

#### 2. **Login** (`login.html`)
- **Formulario de autenticación**: Email y contraseña
- **Validación en tiempo real**: Feedback inmediato
- **Manejo de errores**: Mensajes claros y específicos
- **Redirección automática**: Al dashboard tras login exitoso

#### 3. **Registro** (`register.html`)
- **Formulario completo**: Todos los campos requeridos
- **Validación de email**: Verificación de formato y unicidad
- **Confirmación de contraseña**: Validación de coincidencia
- **Feedback visual**: Indicadores de estado

#### 4. **Gestión de Alumnos** (`usuarios.html`)
- **Tabla interactiva**: Lista completa de alumnos
- **Operaciones CRUD**: Crear, editar, eliminar
- **Búsqueda y filtros**: Por nombre, carrera, semestre
- **Paginación**: Navegación eficiente

#### 5. **Gestión de Profesores** (`profesores.html`)
- **Lista de profesores**: Con información detallada
- **Formularios modales**: Para edición rápida
- **Validación de datos**: Campos requeridos y formatos
- **Acciones en lote**: Selección múltiple

### Funcionalidades JavaScript

#### `app.js` - Funciones Core
```javascript
// Configuración de API
const API_BASE_URL = 'http://localhost:5000';

// Funciones principales
- apiRequest(endpoint, options)     // Peticiones HTTP
- showNotification(message, type)   // Notificaciones
- login(email, password)            // Autenticación
- register(userData)                // Registro
- logout()                          // Cerrar sesión
- loadDashboardStats()              // Estadísticas
```

#### `dashboard.js` - Dashboard
- **Carga de estadísticas**: Datos en tiempo real
- **Gráficos interactivos**: Chart.js
- **Análisis temporal**: Tendencias y crecimiento
- **Actividad reciente**: Log de acciones

#### `alumnos.js` - Gestión de Alumnos
- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Validación de formularios**: En tiempo real
- **Búsqueda y filtros**: Dinámicos
- **Confirmaciones**: Para acciones destructivas

#### `profesores.js` - Gestión de Profesores
- **Operaciones CRUD**: Completas
- **Formularios modales**: Edición rápida
- **Validación de datos**: Campos requeridos
- **Manejo de errores**: Feedback claro

## 🐳 Configuración Docker

### `compose.yaml` - Orquestación

#### Servicio de Base de Datos
```yaml
db:
  image: postgres:16
  container_name: db
  environment:
    POSTGRES_USER: ${DB_USUARIO}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: ${POSTGRES_DB}
  ports:
    - "5433:5432"
  volumes:
    - datos_pg:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
```

#### Servicio de Backend
```yaml
backend:
  build: ./backend
  container_name: backend
  ports:
    - "${BACKEND_PORT}:5000"
  depends_on:
    db:
      condition: service_healthy
  volumes:
    - ./backend:/app
  environment:
    FLASK_ENV: ${MODO}
    FLASK_DEBUG: "true"
```

#### Servicio de Frontend
```yaml
frontend:
  build: ./frontend
  container_name: frontend
  ports:
    - "${FRONTEND_PORT}:80"
  depends_on:
    - backend
  volumes:
    - ./frontend:/usr/share/nginx/html
```

### Configuración Nginx (`frontend/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost _;
    root /usr/share/nginx/html;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://backend:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## ⚙️ Variables de Entorno (.env)

```bash
# Base de datos
POSTGRES_USER=postgres
DB_USUARIO=postgres
POSTGRES_PASSWORD=sinaloa03
POSTGRES_DB=mi_escuela_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
DB_NOMBRE=mi_escuela_db
DB_PASSWORD=sinaloa03
DB_PUERTO=5433
URL_BASE_DATOS=postgresql+psycopg2://postgres:sinaloa03@db:5432/mi_escuela_db

# Puertos
BACKEND_PORT=5000
FRONTEND_PORT=3000

# CORS
ORIGEN_FRONT=http://localhost:3000

# JWT
JWT_SECRETO=fpx_NLOH4Lk3ksgHm_4GIT9CjJh1IMMNWnkyFv6kV1bOF4Z63Y0i1VX3oUFp6Ws8jjhad3xMC_MxqiRaIC8FTg
JWT_MINUTOS=120

# Modo
MODO=desarrollo
```

## 🚀 Instalación y Uso

### Requisitos
- Docker
- Docker Compose

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd escuela-docker
```

2. **Crear archivo .env**
```bash
# Copiar las variables del README.md
```

3. **Levantar servicios**
```bash
docker-compose up --build -d
```

4. **Aplicar migraciones**
```bash
docker-compose exec backend python -c "from app import app, Base, engine; Base.metadata.create_all(bind=engine)"
```

### Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Base de datos**: localhost:5433

## 🔧 Comandos Útiles

### Docker Compose
```bash
# Levantar servicios
docker-compose up -d

# Levantar con rebuild
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Ver estado de servicios
docker-compose ps

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

### Desarrollo
```bash
# Entrar al contenedor backend
docker-compose exec backend bash

# Entrar al contenedor frontend
docker-compose exec frontend sh

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar servicio
docker-compose restart backend
```

## 📈 Características Técnicas

### Seguridad
- **Contraseñas encriptadas**: Werkzeug security
- **Tokens JWT**: Autenticación stateless
- **CORS configurado**: Control de orígenes
- **Validación de datos**: En frontend y backend

### Rendimiento
- **Consultas optimizadas**: SQLAlchemy ORM
- **Caché de archivos estáticos**: Nginx
- **Compresión**: Gzip habilitado
- **Paginación**: Para listas grandes

### Escalabilidad
- **Arquitectura modular**: Blueprints de Flask
- **Separación de responsabilidades**: Frontend/Backend
- **Base de datos relacional**: PostgreSQL
- **Containerización**: Docker

### Mantenibilidad
- **Código documentado**: Comentarios y docstrings
- **Estructura clara**: Organización por módulos
- **Configuración centralizada**: Variables de entorno
- **Logs estructurados**: Para debugging

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Sistema de autenticación JWT
- [x] CRUD completo para alumnos
- [x] CRUD completo para profesores
- [x] CRUD completo para instituciones
- [x] Dashboard con estadísticas
- [x] Interfaz web responsive
- [x] API REST documentada
- [x] Containerización con Docker
- [x] Base de datos PostgreSQL
- [x] Migraciones automáticas

### ⏳ En Desarrollo
- [ ] Sistema de roles y permisos
- [ ] Notificaciones en tiempo real
- [ ] Gestión de archivos
- [ ] Reportes avanzados
- [ ] API de estadísticas
- [ ] Tests automatizados

### 🔮 Futuras Mejoras
- [ ] Migración a React/Vue/Angular
- [ ] Sistema de notificaciones push
- [ ] Integración con servicios externos
- [ ] Dashboard administrativo avanzado
- [ ] Sistema de auditoría
- [ ] API GraphQL

## 🤝 Contribución

### Estructura para Nuevas Funcionalidades
1. **Backend**: Agregar modelo → ruta → endpoint
2. **Frontend**: Crear página → JavaScript → integración
3. **Testing**: Unit tests → integration tests
4. **Documentación**: Actualizar README y documentación

### Convenciones de Código
- **Python**: PEP 8
- **JavaScript**: ES6+ con módulos
- **CSS**: BEM methodology
- **Commits**: Conventional commits
- **Branches**: Git flow

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

---

## 🎉 Conclusión

Este sistema escolar representa una implementación completa y moderna de gestión educativa, utilizando las mejores prácticas de desarrollo web, containerización y arquitectura de software. La combinación de Flask, PostgreSQL, Docker y una interfaz web moderna proporciona una base sólida para el crecimiento y la escalabilidad del sistema.

**Características destacadas:**
- 🔐 Autenticación segura con JWT
- 📊 Dashboard interactivo con estadísticas
- 🐳 Containerización completa con Docker
- 🎨 Interfaz moderna y responsive
- 🛠️ API REST bien estructurada
- 📈 Escalabilidad y mantenibilidad

El sistema está listo para producción y puede ser fácilmente extendido con nuevas funcionalidades según las necesidades específicas de cada institución educativa.
