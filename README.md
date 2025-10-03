# Sistema Escolar con Docker

Un sistema completo de gestión escolar desarrollado con Flask, PostgreSQL y frontend HTML/CSS/JavaScript, todo orquestado con Docker Compose.

## 🏗️ Arquitectura

```
escuela-docker/
├── backend/           # API Flask con autenticación JWT
│   ├── app.py         # Aplicación principal Flask
│   ├── Dockerfile     # Imagen Docker para backend
│   └── requirements.txt
├── frontend/          # Frontend HTML/CSS/JS
│   ├── css/           # Estilos CSS
│   ├── js/            # JavaScript
│   ├── assets/        # Recursos estáticos
│   ├── index.html     # Dashboard
│   ├── login.html     # Página de login
│   ├── register.html  # Página de registro
│   ├── Dockerfile     # Imagen Docker para frontend
│   └── nginx.conf     # Configuración Nginx
├── compose.yaml      # Orquestación Docker
└── .env              # Variables de entorno
```

## 🚀 Inicio Rápido

### Requisitos
- Docker
- Docker Compose

### Instalación

1. **Clonar el repositorio:**
```bash
git clone <repo-url>
cd escuela-docker
```

2. **Crear archivo .env:**
```bash
# Crear archivo .env con las siguientes variables:
POSTGRES_USER=postgres
DB_USUARIO=postgres
POSTGRES_PASSWORD=sinaloa03
POSTGRES_DB=mi_escuela_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
DB_NOMBRE=mi_escuela_db
DB_PASSWORD=sinaloa03
DB_PUERTO=5433
BACKEND_PORT=5000
FRONTEND_PORT=3000
URL_BASE_DATOS=postgresql+psycopg2://postgres:sinaloa03@db:5432/mi_escuela_db
ORIGEN_FRONT=http://localhost:3000
JWT_SECRETO=fpx_NLOH4Lk3ksgHm_4GIT9CjJh1IMMNWnkyFv6kV1bOF4Z63Y0i1VX3oUFp6Ws8jjhad3xMC_MxqiRaIC8FTgfpx_NLOH4Lk3ksgHm_4GIT9CjJh1IMMNWnkyFv6kV1bOF4Z63Y0i1VX3oUFp6Ws8jjhad3xMC_MxqiRaIC8FTg
JWT_MINUTOS=120
MODO=desarrollo
```

3. **Levantar servicios:**
```bash
docker-compose up --build -d
```

4. **Aplicar migraciones de base de datos:**
```bash
docker-compose exec backend python -c "from app import app, Base, engine; Base.metadata.create_all(bind=engine)"
```

## 🌐 Acceso a la Aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Base de datos:** localhost:5433 (DBeaver, pgAdmin, etc.)

## 📚 API Endpoints

### Autenticación
- `POST /register` - Registro de alumnos
- `POST /login` - Inicio de sesión
- `GET /profile` - Perfil del usuario (requiere token)

### Alumnos
- `GET /alumnos` - Listar alumnos
- `GET /alumnos/{id}` - Obtener alumno
- `POST /alumnos` - Crear alumno
- `PUT /alumnos/{id}` - Actualizar alumno
- `DELETE /alumnos/{id}` - Eliminar alumno

### Profesores
- `GET /profesores` - Listar profesores
- `GET /profesores/{id}` - Obtener profesor
- `POST /profesores` - Crear profesor
- `PUT /profesores/{id}` - Actualizar profesor
- `DELETE /profesores/{id}` - Eliminar profesor

### Instituciones
- `GET /instituciones` - Listar instituciones
- `GET /instituciones/{id}` - Obtener institución
- `POST /instituciones` - Crear institución
- `PUT /instituciones/{id}` - Actualizar institución
- `DELETE /instituciones/{id}` - Eliminar institución

## 🔐 Autenticación JWT

El sistema usa tokens JWT para autenticación. Los tokens se envían en el header:
```
Authorization: <token>
```

## 🛠️ Desarrollo

### Estructura del Frontend
```
frontend/
├── css/
│   └── style.css          # Estilos principales
├── js/
│   ├── app.js             # Funciones comunes de API
│   ├── login.js           # Lógica específica de login
│   └── register.js        # Lógica específica de registro
├── assets/                # Recursos estáticos
├── index.html             # Dashboard principal
├── login.html             # Página de login
├── register.html           # Página de registro
├── Dockerfile             # Imagen Docker
└── nginx.conf             # Configuración Nginx
```

### Tecnologías Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsive
- **JavaScript ES6+** - Lógica del cliente
- **Bootstrap 5** - Framework CSS
- **Nginx** - Servidor web

### Tecnologías Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación de tokens
- **Werkzeug** - Hasheo de contraseñas

## 📝 Comandos Útiles

### Docker Compose
```bash
# Levantar servicios
docker-compose up -d

# Levantar con rebuild
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Ver todos los servicios
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

# Ver logs del backend
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart frontend
```

## 🔄 Migración Futura

Este proyecto está diseñado para migración fácil a frameworks modernos:

### HTML/CSS/JS → React/Vue/Angular
La estructura actual facilita la migración:
1. Componentes ya identificados
2. API establecida
3. Estructura de datos definida
4. Rutas y navegación claras

### Desarrollo Adicional
- ✅ Sistema de autenticación JWT
- ✅ CRUD básico funcional
- ⏳ Sistema completo de CRUD (alumnos, profesores, instituciones)
- ⏳ Dashboard con estadísticas
- ⏳ Gestión de archivos
- ⏳ Notificaciones en tiempo real

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).
