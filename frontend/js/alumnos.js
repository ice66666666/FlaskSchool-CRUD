// Gestión de Alumnos JavaScript
let usersData = [];
let editingUserId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadUsers();
    setupEventListeners();
});

async function loadUsers() {
    try {
        showLoading(true);
        
        // Cargar alumnos desde la API
        const response = await fetch('http://localhost:5000/alumnos');
        if (response.ok) {
            usersData = await response.json();
            renderUsersTable();
            updateStats();
        } else {
            window.app.showNotification('Error cargando alumnos', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        window.app.showNotification('Error de conexión', 'danger');
    } finally {
        showLoading(false);
    }
}

function renderUsersTable() {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    if (usersData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    No hay alumnos registrados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = usersData.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.nombre} ${user.apellido}</td>
            <td>${user.email}</td>
            <td>${user.carrera}</td>
            <td>${user.semestre}</td>
            <td>${user.periodo}</td>
            <td>${formatDate(user.fecha_creacion)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editUser(${user.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteUser(${user.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    document.getElementById('total-users').textContent = usersData.length;
    document.getElementById('active-users').textContent = usersData.length; // Todos activos por ahora
    document.getElementById('total-careers').textContent = 
        [...new Set(usersData.map(u => u.carrera))].length;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function setupEventListeners() {
    // Buscar alumnos
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const rows = document.querySelectorAll('#usersTable tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
    
    // Formulario de usuario
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }
}

function openNewUserModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Alumno';
    document.getElementById('userForm').reset();
    clearValidationErrors();
}

function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    editingUserId = userId;
    document.getElementById('modalTitle').textContent = 'Editar Alumno';
    
    // Llenar formulario
    document.getElementById('modalNombre').value = user.nombre;
    document.getElementById('modalApellido').value = user.apellido;
    document.getElementById('modalEmail').value = user.email;
    document.getElementById('modalPassword').value = ''; // No mostrar password existente
    document.getElementById('modalSemestre').value = user.semestre;
    document.getElementById('modalCarrera').value = user.carrera;
    document.getElementById('modalPeriodo').value = user.periodo;
    
    clearValidationErrors();
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

async function handleUserSubmit(e) {
    e.preventDefault();
    
    clearValidationErrors();
    
    const formData = {
        nombre: document.getElementById('modalNombre').value.trim(),
        apellido: document.getElementById('modalApellido').value.trim(),
        email: document.getElementById('modalEmail').value.trim(),
        password: document.getElementById('modalPassword').value,
        semestre: parseInt(document.getElementById('modalSemestre').value),
        carrera: document.getElementById('modalCarrera').value.trim(),
        periodo: document.getElementById('modalPeriodo').value.trim()
    };
    
    // Validaciones
    if (!validateUserForm(formData)) {
        return;
    }
    
    showLoading(true);
    
    try {
        let response;
        if (editingUserId) {
            // Actualizar alumno existente
            response = await fetch(`http://localhost:5000/alumnos/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Crear nuevo alumno
            response = await fetch('http://localhost:5000/alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        if (response.ok) {
            window.app.showNotification(
                editingUserId ? 'Alumno actualizado' : 'Alumno creado',
                'success'
            );
            await loadUsers(); // Recargar tabla
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        } else {
            const error = await response.json();
            window.app.showNotification(error.error || 'Error guardando alumno', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        window.app.showNotification('Error de conexión', 'danger');
    } finally {
        showLoading(false);
    }
}

async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de eliminar este alumno?')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/alumnos/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            window.app.showNotification('Alumno eliminado', 'success');
            await loadUsers(); // Recargar tabla
        } else {
            const error = await response.json();
            window.app.showNotification(error.error || 'Error eliminando alumno', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        window.app.showNotification('Error de conexión', 'danger');
    }
}

function validateUserForm(data) {
    let isValid = true;
    
    if (!data.nombre || data.nombre.length < 2) {
        showFieldError('modalNombre', 'Nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    if (!data.apellido || data.apellido.length < 2) {
        showFieldError('modalApellido', 'Apellido debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showFieldError('modalEmail', 'Ingresa un email válido');
        isValid = false;
    }
    
    if (!editingUserId && (!data.password || data.password.length < 6)) {
        showFieldError('modalPassword', 'Contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    if (!data.semestre || data.semestre < 1 || data.semestre > 10) {
        showFieldError('modalSemestre', 'Selecciona un semestre válido');
        isValid = false;
    }
    
    if (!data.carrera || data.carrera === '') {
        showFieldError('modalCarrera', 'Selecciona una carrera');
        isValid = false;
    }
    
    if (!data.periodo || data.periodo === '') {
        showFieldError('modalPeriodo', 'Selecciona un periodo');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    
    field.classList.add('is-invalid');
    feedback.textContent = message;
    field.focus();
}

function clearValidationErrors() {
    document.querySelectorAll('#userForm .form-control, #userForm .form-select').forEach(field => {
        field.classList.remove('is-invalid');
    });
    document.querySelectorAll('#userForm .invalid-feedback').forEach(feedback => {
        feedback.textContent = '';
    });
}

function showLoading(show) {
    const spinner = document.querySelector('#userForm .spinner-border');
    const submitBtn = document.querySelector('#userForm button[type="submit"]');
    
    if (show) {
        spinner.classList.remove('d-none');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Guardando...';
    } else {
        spinner.classList.add('d-none');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Guardar Alumno';
    }
}

function refreshUsers() {
    loadUsers();
}

// Funciones globales para usar desde HTML
window.editUser = editUser;
window.deleteUser = deleteUser;
window.openNewUserModal = openNewUserModal;
window.refreshUsers = refreshUsers;
