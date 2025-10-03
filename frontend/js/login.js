// Login específico JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const spinner = loginForm.querySelector('.spinner-border');
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        clearValidationErrors();
        
        // Obtener datos del formulario
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validaciones básicas
        if (!email) {
            showFieldError('email', 'El email es requerido');
            return;
        }
        
        if (!password) {
            showFieldError('password', 'La contraseña es requerida');
            return;
        }
        
        // Mostrar estado de carga
        showLoading(true);
        
        try {
            // Hacer login
            const response = await window.app.login(email, password);
            
            // Si el login es exitoso, redirigir al dashboard
            if (response.token) {
                window.app.showNotification('¡Bienvenido!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error en login:', error);
            // El app.js ya maneja la notificación de error
        } finally {
            showLoading(false);
        }
    });
    
    function showLoading(isLoading) {
        if (isLoading) {
            spinner.classList.remove('d-none');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Iniciando sesión...';
        } else {
            spinner.classList.add('d-none');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Iniciar Sesión';
        }
    }
    
    function clearValidationErrors() {
        document.querySelectorAll('.form-control').forEach(field => {
            field.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
            feedback.textContent = '';
        });
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        
        field.classList.add('is-invalid');
        feedback.textContent = message;
        field.focus();
    }
});
