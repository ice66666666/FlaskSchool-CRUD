// Registro específico JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const spinner = registerForm.querySelector('.spinner-border');
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        clearValidationErrors();
        
        // Obtener datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            semestre: parseInt(document.getElementById('semestre').value),
            carrera: document.getElementById('carrera').value.trim(),
            periodo: document.getElementById('periodo').value.trim()
        };
        
        // Validaciones
        if (!validateForm(formData)) {
            return;
        }
        
        // Mostrar estado de carga
        showLoading(true);
        
        try {
            // Preparar datos para envío (eliminar confirmPassword)
            const { confirmPassword, ...userData } = formData;
            
            // Registrar usuario
            const response = await window.app.register(userData);
            
            // Si el registro es exitoso, mostrar mensaje y opción de login
            if (response.id) {
                window.app.showNotification('¡Usuario registrado exitosamente!', 'success');
                
                // Limpiar formulario
                registerForm.reset();
                
                // Después de un momento, mostrar opción de ir a login
                setTimeout(() => {
                    if (confirm('¿Deseas iniciar sesión ahora?')) {
                        window.location.href = 'login.html';
                    }
                }, 1500);
            }
            
        } catch (error) {
            console.error('Error en registro:', error);
            // El app.js ya maneja la notificación de error
        } finally {
            showLoading(false);
        }
    });
    
    function validateForm(data) {
        let isValid = true;
        
        // Validar nombre
        if (!data.nombre || data.nombre.length < 2) {
            showFieldError('nombre', 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }
        
        // Validar apellido
        if (!data.apellido || data.apellido.length < 2) {
            showFieldError('apellido', 'El apellido debe tener al menos 2 caracteres');
            isValid = false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Ingresa un email válido');
            isValid = false;
        }
        
        // Validar contraseña
        if (!data.password || data.password.length < 6) {
            showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }
        
        // Validar confirmación de contraseña
        if (!data.confirmPassword) {
            showFieldError('confirmPassword', 'Confirma tu contraseña');
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            showFieldError('confirmPassword', 'Las contraseñas no coinciden');
            isValid = false;
        }
        
        // Validar semestre
        if (!data.semestre || data.semestre < 1 || data.semestre > 10) {
            showFieldError('semestre', 'Selecciona un semestre válido');
            isValid = false;
        }
        
        // Validar carrera
        if (!data.carrera || data.carrera.length < 3) {
            showFieldError('carrera', 'La carrera debe tener al menos 3 caracteres');
            isValid = false;
        }
        
        // Validar periodo
        if (!data.periodo || data.periodo.length < 5) {
            showFieldError('periodo', 'El periodo debe tener al menos 5 caracteres');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showLoading(isLoading) {
        if (isLoading) {
            spinner.classList.remove('d-none');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Registrando...';
        } else {
            spinner.classList.add('d-none');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Registrar Usuario';
        }
    }
    
    function clearValidationErrors() {
        document.querySelectorAll('.form-control, .form-select').forEach(field => {
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
