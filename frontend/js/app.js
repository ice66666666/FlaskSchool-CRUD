// Configuración de la aplicación
const API_BASE_URL = 'http://localhost:5000'; // Cambiar por tu URL del backend

// Token de autenticación (se guardará después del login)
let authToken = null;

// Función para hacer peticiones HTTP
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Agregar token de autenticación si existe
    if (authToken) {
        config.headers['Authorization'] = authToken;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error en la petición');
        }
        
        return data;
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error: ' + error.message, 'danger');
        throw error;
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Función para cargar estadísticas del dashboard
async function loadDashboardStats() {
    try {
        // Cargar datos en paralelo
        const [alumnosData, profesoresData, institucionesData] = await Promise.all([
            apiRequest('/alumnos').catch(() => ({ count: 0 })),
            apiRequest('/profesores').catch(() => ({ count: 0 })),
            apiRequest('/instituciones').catch(() => ({ count: 0 }))
        ]);

        // Mostrar conteos
        document.getElementById('alumnos-count').textContent = 
            Array.isArray(alumnosData) ? alumnosData.length : alumnosData.count || 0;
        document.getElementById('profesores-count').textContent = 
            Array.isArray(profesoresData) ? profesoresData.length : profesoresData.count || 0;
        document.getElementById('instituciones-count').textContent = 
            Array.isArray(institucionesData) ? institucionesData.length : institucionesData.count || 0;
            
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Función para login
async function login(email, password) {
    try {
        const response = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        authToken = response.token;
        localStorage.setItem('authToken', authToken);
        
        showNotification('Login exitoso', 'success');
        return response;
    } catch (error) {
        showNotification('Error en login: ' + error.message, 'danger');
        throw error;
    }
}

// Función para registro
async function register(userData) {
    try {
        const response = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        showNotification('Alumno registrado exitosamente', 'success');
        return response;
    } catch (error) {
        showNotification('Error en registro: ' + error.message, 'danger');
        throw error;
    }
}

// Función para logout
function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}

// Verificar token guardado al cargar la página
function checkAuth() {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        authToken = savedToken;
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Solo cargar estadísticas si estamos en el dashboard
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname.endsWith('/') || 
        window.location.pathname === '') {
        loadDashboardStats();
    }
});

// Exportar funciones para uso global
window.app = {
    apiRequest,
    login,
    register,
    logout,
    showNotification,
    loadDashboardStats
};
