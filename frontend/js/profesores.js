// Gestión de Profesores JavaScript
let profesoresData = [];
let editingProfesorId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadProfesores();
    setupEventListeners();
});

async function loadProfesores() {
    try {
        showLoading(true);
        
        // Cargar profesores desde la API
        const response = await fetch('http://localhost:5000/profesores');
        if (response.ok) {
            profesoresData = await response.json();
            renderProfesoresTable();
            updateStats();
        } else {
            window.app.showNotification('Error cargando profesores', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        window.app.showNotification('Error de conexión', 'danger');
    } finally {
        showLoading(false);
    }
}

function renderProfesoresTable() {
    const tbody = document.querySelector('#profesoresTable tbody');
    if (!tbody) return;
    
    if (profesoresData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    No hay profesores registrados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = profesoresData.map(profesor => `
        <tr>
            <td>${profesor.id}</td>
            <td>${profesor.nombre} ${profesor.apellido}</td>
            <td>${profesor.email}</td>
            <td>${profesor.especialidad}</td>
            <td>${profesor.departamento}</td>
            <td>${formatDate(profesor.fecha_creacion)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editProfesor(${profesor.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteProfesor(${profesor.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    document.getElementById('total-profesores').textContent = profesoresData.length;
    document.getElementById('total-departamentos').textContent = 
        [...new Set(profesoresData.map(p => p.departamento))].length;
    document.getElementById('total-especialidades').textContent = 
        [...new Set(profesoresData.map(p => p.especialidad))].length;
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
    // Buscar profesores
    const searchInput = document.getElementById('searchProfesores');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const rows = document.querySelectorAll('#profesoresTable tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
    
    // Formulario de profesor
    const profesorForm = document.getElementById('profesorForm');
    if (profesorForm) {
        profesorForm.addEventListener('submit', handleProfesorSubmit);
    }
}

function openNewProfesorModal() {
    editingProfesorId = null;
    document.getElementById('modalProfesorTitle').textContent = 'Nuevo Profesor';
    document.getElementById('profesorForm').reset();
    
    // Limpiar validación anterior
    clearValidationErrors();
}

function editProfesor(profesorId) {
    const profesor = profesoresData.find(p => p.id === profesorId);
    if (!profesor) return;
    
    editingProfesorId = profesorId;
    document.getElementById('modalProfesorTitle').textContent = 'Editar Profesor';
    
    // Llenar formulario
    document.getElementById('modalProfesorNombre').value = profesor.nombre;
    document.getElementById('modalProfesorApellido').value = profesor.apellido;
    document.getElementById('modalProfesorEmail').value = profesor.email;
    document.getElementById('modalProfesorEspecialidad').value = profesor.especialidad;
    document.getElementById('modalProfesorDepartamento').value = profesor.departamento;
    
    clearValidationErrors();
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
    modal.show();
}

async function handleProfesorSubmit(e) {
    e.preventDefault();
    
    clearValidationErrors();
    
    const formData = {
        nombre: document.getElementById('modalProfesorNombre').value.trim(),
        apellido: document.getElementById('modalProfesorApellido').value.trim(),
        email: document.getElementById('modalProfesorEmail').value.trim(),
        especialidad: document.getElementById('modalProfesorEspecialidad').value.trim(),
        departamento: document.getElementById('modalProfesorDepartamento').value.trim()
    };
    
    // Validaciones
    if (!validateProfesorForm(formData)) {
        return;
    }
    
    showLoading(true);
    
    try {
        let response;
        if (editingProfesorId) {
            // Actualizar profesor existente
            response = await fetch(`http://localhost:5000/profesores/${editingProfesorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Crear nuevo profesor
            response = await fetch('http://localhost:5000/profesores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        if (response.ok) {
            const result = await response.json();
            
            window.app.showNotification(
                editingProfesorId ? 'Profesor actualizado' : 'Profesor creado',
                'success'
            );
            
            await loadProfesores(); // Recargar tabla
            
            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('profesorModal')).hide();
            
        } else {
            const error = await response.json();
            window.app.showNotification(error.error || 'Error guardando profesor', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        window.app.showNotification('Error de conexión', 'danger');
    } finally {
        showLoading(false);
    }
}

async function deleteProfesor(profesorId) {
    if (!confirm('¿Estás seguro de eliminar este profesor?')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/profesores/${profesorId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            window.app.showNotification('Profesor eliminado', 'success');
            await loadProfesores(); // Recargar tabla
        } else {
            const error = await response.json();
            window.app.showNotification(error.error || 'Error eliminando profesor', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        window.app.showNotification('Error de conexión', 'danger');
    }
}

function validateProfesorForm(data) {
    let isValid = true;
    
    if (!data.nombre || data.nombre.length < 2) {
        showFieldError('modalProfesorNombre', 'Nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    if (!data.apellido || data.apellido.length < 2) {
        showFieldError('modalProfesorApellido', 'Apellido debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showFieldError('modalProfesorEmail', 'Ingresa un email válido');
        isValid = false;
    }
    
    if (!data.especialidad || data.especialidad.length < 3) {
        showFieldError('modalProfesorEspecialidad', 'Especialidad debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    if (!data.departamento || data.departamento.length < 3) {
        showFieldError('modalProfesorDepartamento', 'Departamento debe tener al menos 3 caracteres');
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
    document.querySelectorAll('#profesorForm .form-control').forEach(field => {
        field.classList.remove('is-invalid');
    });
    document.querySelectorAll('#profesorForm .invalid-feedback').forEach(feedback => {
        feedback.textContent = '';
    });
}

function showLoading(show) {
    const spinner = document.querySelector('#profesorForm .spinner-border');
    const submitBtn = document.querySelector('#profesorForm button[type="submit"]');
    
    if (show) {
        spinner.classList.remove('d-none');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Guardando...';
    } else {
        spinner.classList.add('d-none');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Guardar Profesor';
    }
}

function refreshProfesores() {
    loadProfesores();
}

// Funciones globales para usar desde HTML
window.editProfesor = editProfesor;
window.deleteProfesor = deleteProfesor;
window.openNewProfesorModal = openNewProfesorModal;
window.refreshProfesores = refreshProfesores;
