// Navegación inteligente basada en autenticación
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupNavigation();
        this.updateNavbar();
    }

    checkAuthStatus() {
        this.isAuthenticated = !!localStorage.getItem('authToken');
        this.currentUser = null;
        
        if (this.isAuthenticated) {
            try {
                const token = localStorage.getItem('authToken');
                // Decodificar token JWT simple (solo para obtener info básica)
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.currentUser = payload;
            } catch (e) {
                // Token inválido o expirado
                this.isAuthenticated = false;
                localStorage.removeItem('authToken');
            }
        }
    }

    setupNavigation() {
        // Crear navegación inteligente basada en estado de autenticación
        const navbars = document.querySelectorAll('nav');
        
        navbars.forEach(navbar => {
            this.updateNavbarHTML(navbar);
        });
    }

    updateNavbarHTML(navbar) {
        if (!navbar) return;

        const navContainer = navbar.querySelector('.container, .container-fluid');
        if (!navContainer) return;

        navContainer.innerHTML = `
            <a class="navbar-brand" href="index.html">📊 Sistema Escolar</a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                ${this.isAuthenticated ? this.getAuthenticatedNav() : this.getUnauthenticatedNav()}
            </div>
        `;
    }

    getAuthenticatedNav() {
        return `
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="usuarios.html">👥 Alumnos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="profesores.html">👨‍🏫 Profesores</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="instituciones.html">🏫 Instituciones</a>
                </li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        👤 ${this.currentUser?.email || 'Usuario'}
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="profile.html">Mi Perfil</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item" onclick="window.app.logout()">Cerrar Sesión</button></li>
                    </ul>
                </li>
            </ul>
        `;
    }

    getUnauthenticatedNav() {
        return `
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Dashboard</a>
                </li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="login.html">Iniciar Sesión</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="register.html">Registrarse</a>
                </li>
            </ul>
        `;
    }

    updateNavbar() {
        // Marcar página actual como activa
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        
        const pageMap = {
            'index.html': 'index.html',
            'usuarios.html': 'usuarios.html',
            'profesores.html': 'profesores.html',
            'instituciones.html': 'instituciones.html',
            'login.html': 'login.html',
            'register.html': 'register.html',
            '': 'index.html'
        };
        
        return pageMap[fileName] || 'index.html';
    }

    // Redirigir si no está autenticado cuando es necesario
    requireAuth(paths = []) {
        const currentPage = this.getCurrentPage();
        
        if (paths.includes(currentPage) && !this.isAuthenticated) {
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    }

    // Redirigir si ya está autenticado a páginas de auth
    redirectIfAuthenticated(paths = ['login.html', 'register.html']) {
        const currentPage = this.getCurrentPage();
        
        if (paths.includes(currentPage) && this.isAuthenticated) {
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    }
}

// Inicializar navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.navManager = new NavigationManager();
    
    // Proteger rutas que requieren autenticación
    const pagesRequiringAuth = ['usuarios.html', 'profesores.html', 'instituciones.html', 'profile.html'];
    window.navManager.requireAuth(pagesRequiringAuth);
    
    // Redirigir desde páginas de auth si ya está autenticado
    window.navManager.redirectIfAuthenticated();
});

// Exportar para uso global
window.NavigationManager = NavigationManager;
