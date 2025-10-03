# 📚 Instrucciones para Usar los READMEs

## Resumen

Se han creado **3 versiones diferentes del README** para adaptarse a las necesidades específicas de cada repositorio:

1. **`README.md`** - Versión principal actual (completa)
2. **`README-BACKEND.md`** - Para el repositorio del backend
3. **`README-FRONTEND.md`** - Para el repositorio del frontend

## 🎯 Cuándo Usar Cada Uno

### README Principal (`README.md`)
**Uso:** Repositorio completo con docker-compose
- ✅ Para el repositorio principal que contiene todo el proyecto
- ✅ Documentación completa del sistema integrado
- ✅ Instrucciones para ejecutar con Docker Compose
- ✅ Información sobre la arquitectura completa

### README Backend (`README-BACKEND.md`)
**Uso:** Repositorio independiente del backend
- ✅ Solo contiene código Python/Flask
- ✅ Documentación específica de la API
- ✅ Variables de entorno del backend
- ✅ Instrucciones de desarrollo backend únicamente

### README Frontend (`README-FRONTEND.md`)
**Uso:** Repositorio independiente del frontend
- ✅ Solo contiene código HTML/CSS/JavaScript
- ✅ Documentación específica del frontend
- ✅ Configuración de Nginx
- ✅ Instrucciones de desarrollo frontend únicamente

## 🔧 Instrucciones de Uso

### Para Repositorio Principal (Monorepo)

1. **Mantener** el archivo `README.md` actual
2. **Incluir** todos los archivos del proyecto:
   ```
   - backend/
   - frontend/
   - compose.yaml
   - .env
   - README.md
   ```
3. **Usar** los comandos de Docker Compose descritos

### Para Repositorio Backend Separado

1. **Renombrar** `README-BACKEND.md` → `README.md`
2. **Incluir** solo los archivos del backend:
   ```
   - app.py
   - config.py
   - models/
   - routes/
   - utils/
   - Dockerfile
   - requirements.txt
   - README.md
   ```
3. **Ajustar** las variables de entorno según el entorno

### Para Repositorio Frontend Separado

1. **Renombrar** `README-FRONTEND.md` → `README.md`
2. **Incluir** solo los archivos del frontend:
   ```
   - css/
   - js/
   - assets/
   - *.html files
   - Dockerfile
   - nginx.conf
   - README.md
   ```
3. **Configurar** la URL del backend en `js/api.js`

## 📝 Cambios Realizados

### Correcciones en README Principal
- ✅ **Endpoints corregidos**: `/usuarios` → `/alumnos` para consistencia con el código
- ✅ **Documentación actualizada** de endpoints de alumnos
- ✅ **Términos consistentes**: usuarios → alumnos en todo el documento

### Nuevas Características en READMEs Específicos
- ✅ **README Backend**: Documentación completa de API, modelos, variables de entorno específicas
- ✅ **README Frontend**: Documentación detallada de páginas, componentes JavaScript, configuración de Nginx
- ✅ **Ambos**: Comandos específicos de desarrollo, deployment independiente, tecnologías específicas

## 🚀 Ejemplo de Separación

### Estructura Monorepo
```
escuela-docker/
├── backend/
├── frontend/
├── compose.yaml
└── README.md (versión actual)
```

### Estructura Backend Separado
```
backend-api/
├── app.py
├── config.py
├── models/
├── routes/
├── utils/
├── Dockerfile
├── requirements.txt
└── README.md (README-BACKEND.md renombrado)
```

### Estructura Frontend Separado
```
frontend-web/
├── css/
├── js/
├── assets/
├── *.html
├── Dockerfile
├── nginx.conf
└── README.md (README-FRONTEND.md renombrado)
```

## ⚙️ Configuración de URLs

### URL del Backend en Frontend Separado
Actualizar en `js/api.js`:
```javascript
// Para desarrollo local
const API_BASE_URL = 'http://localhost:5000';

// Para producción
const API_BASE_URL = 'https://api.tudominio.com';
```

### CORS en Backend Separado
Ajustar en `config.py`:
```python
# Permitir el origen del frontend
CORS_ORIGINS = [
    "http://localhost:3000",      # Desarrollo local
    "https://app.tudominio.com"   # Producción
]
```

## 📋 Checklist para Separación

### Backend Separado
- [ ] Renombrar `README-BACKEND.md` → `README.md`
- [ ] Incluir solo archivos del backend
- [ ] Actualizar URLs de API en documentación
- [ ] Configurar variables de entorno específicas
- [ ] Ajustar configuraciones de CORS
- [ ] Incluir instrucciones de setup local y Docker

### Frontend Separado
- [ ] Renombrar `README-FRONTEND.md` → `README.md`
- [ ] Incluir solo archivos del frontend
- [ ] Configurar URL del backend en código JavaScript
- [ ] Actualizar configuración de Nginx
- [ ] Incluir instrucciones de build y deployment
- [ ] Documentar configuración de desarrollo

## 🔗 Archivos Adjuntos

Los archivos creados están listos para usar:
- `README-BACKEND.md` - Listo para repositorio backend
- `README-FRONTEND.md` - Listo para repositorio frontend
- `README.md` - Actualizado y corregido
- `INSTRUCCIONES_README.md` - Este documento

## 💡 Recomendaciones

1. **Pruébalos** localmente antes de crear los repos separados
2. **Actualiza** las URLs según tu dominio específico
3. **Personaliza** según tus necesidades específicas
4. **Mantén** copias de seguridad de los READMEs originales
5. **Documenta** cualquier configuración adicional específica de tu entorno

---

¡Los READMEs están listos para usar en cualquier configuración! 🎉
