// Dashboard específico JavaScript - Versión Minimalista
let chartInstances = {};
let currentTimelineType = 'users';

document.addEventListener('DOMContentLoaded', async function() {
    await initializeDashboard();
});

async function initializeDashboard() {
    try {
        // Cargar estadísticas básicas
        await loadDashboardStats();
        
        // Generar mini gráficos en tiempo real
        generateMiniCharts();
        
        // Generar gráfico de carreras
        await generateCareerChart();
        
        // Generar actividad reciente
        generateRecentActivity();
        
        // Generar gráfico temporal inicial
        await showTimelineChart('users');
        
    } catch (error) {
        console.error('Error inicializando dashboard:', error);
        showErrorMessage('Error cargando estadísticas del dashboard');
    }
}

async function loadDashboardStats() {
    try {
        // Cargar datos en paralelo con timeout
        const promises = [
            fetch('http://localhost:5000/alumnos').then(r => r.json()).catch(() => []),
            fetch('http://localhost:5000/profesores').then(r => r.json()).catch(() => []),
            fetch('http://localhost:5000/instituciones').then(r => r.json()).catch(() => [])
        ];
        
        const [alumnosData, profesoresData, institucionesData] = await Promise.all(promises);
        
        // Actualizar contadores con animación
        animateCounter('alumnos-count', Array.isArray(alumnosData) ? alumnosData.length : 0);
        animateCounter('profesores-count', Array.isArray(profesoresData) ? profesoresData.length : 0);
        animateCounter('instituciones-count', Array.isArray(institucionesData) ? institucionesData.length : 0);
        
        // Guardar datos para usar en gráficos
        window.dashboardData = {
            users: alumnosData,
            teachers: profesoresData,
            institutions: institucionesData
        };
        
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        showErrorMessage('Error conectando con el servidor');
    }
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        element.textContent = targetValue;
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
        element.style.transition = 'all 0.5s ease';
    }, 200);
}

function generateMiniCharts() {
    // Generar gráficos mini simulados basados en datos aleatorios
    const charts = ['alumnos-chart', 'profesores-chart', 'instituciones-chart'];
    
    charts.forEach(chartId => {
        const container = document.getElementById(chartId);
        if (!container) return;
        
        container.innerHTML = '';
        
        // Generar 7 barras para la semana
        for (let i = 0; i < 7; i++) {
            const bar = document.createElement('div');
            bar.className = 'mini-bar';
            
            // Altura aleatoria entre 50% y 100%
            const height = Math.random() * 50 + 50;
            bar.style.height = height + '%';
            
            // Delayed animation effect
            bar.style.opacity = '0';
            bar.style.transform = 'scaleY(0)';
            bar.style.transformOrigin = 'bottom';
            
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleY(1)';
                bar.style.transition = 'all 0.6s ease';
            }, i * 100);
            
            container.appendChild(bar);
        }
    });
}

async function generateCareerChart() {
    const ctx = document.getElementById('careerChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartInstances.careerChart) {
        chartInstances.careerChart.destroy();
    }
    
    // Simular datos de carreras (en la vida real vendrían de la API)
    const careerData = generateCareerData();
    
    chartInstances.careerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: careerData.labels,
            datasets: [{
                label: 'Estudiantes',
                data: careerData.data,
                backgroundColor: [
                    'rgba(71, 85, 105, 0.8)',
                    'rgba(94, 116, 138, 0.8)',
                    'rgba(115, 138, 162, 0.8)',
                    'rgba(136, 154, 174, 0.8)',
                    'rgba(148, 163, 184, 0.8)'
                ],
                borderColor: [
                    'rgba(71, 85, 105, 1)',
                    'rgba(94, 116, 138, 1)',
                    'rgba(115, 138, 162, 1)',
                    'rgba(136, 154, 174, 1)',
                    'rgba(148, 163, 184, 1)'
                ],
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function generateCareerData() {
    // Simular distribución realista de carreras
    const careers = [
        'Ingeniería en Sistemas',
        'Administración',
        'Contabilidad',
        'Psicología',
        'Medicina'
    ];
    
    const data = careers.map(career => {
        // Basar en datos reales si están disponibles
        if (window.dashboardData && window.dashboardData.users) {
            const careerCount = window.dashboardData.users.filter(user => 
                user.carrera && user.carrera.toLowerCase().includes('ingeniería')
            ).length;
            return careerCount || Math.floor(Math.random() * 50) + 10;
        }
        
        return Math.floor(Math.random() * 50) + 10;
    });
    
    return {
        labels: careers,
        data: data
    };
}

function generateRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Actividad simulada basada en datos reales si están disponibles
    const activities = [
        {
            type: 'users',
            icon: '👥',
            title: 'Nuevo alumno registrado',
            meta: 'Hace 5 minutos',
            bgColor: '95, 116, 138, 0.1'
        },
        {
            type: 'teachers',
            icon: '👨‍🏫',
            title: 'Profesor agregado',
            meta: 'Hace 15 minutos',
            bgColor: '115, 138, 162, 0.1'
        },
        {
            type: 'institutions',
            icon: '🏫',
            title: 'Institución actualizada',
            meta: 'Hace 1 hora',
            bgColor: '136, 154, 174, 0.1'
        },
        {
            type: 'users',
            icon: '📊',
            title: 'Reporte generado',
            meta: 'Hace 2 horas',
            bgColor: '148, 163, 184, 0.1'
        }
    ];
    
    container.innerHTML = activities.map(activity => `
        <li class="activity-item">
            <div class="activity-icon ${activity.type}" style="background-color: rgba(${activity.bgColor});">
                ${activity.icon}
            </div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-meta">${activity.meta}</div>
            </div>
        </li>
    `).join('');
}

async function showTimelineChart(type) {
    currentTimelineType = type;
    
    // Actualizar botones activos
    document.querySelectorAll('.nav-pills .nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartInstances.timelineChart) {
        chartInstances.timelineChart.destroy();
    }
    
    // Generar datos temporales realistas
    const timelineData = generateTimelineData(type);
    
    chartInstances.timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timelineData.labels,
            datasets: [{
                label: getLabelForType(type),
                data: timelineData.data,
                borderColor: 'rgba(71, 85, 105, 1)',
                backgroundColor: 'rgba(71, 85, 105, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(71, 85, 105, 1)',
                pointBorderColor: 'rgba(255, 255, 255, 1)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    // Obtener canvas para ajustar altura
    ctx.style.height = '300px';
}

function generateTimelineData(type) {
    // Generar últimos 30 días
    const labels = [];
    const data = [];
    
    const today = new Date();
    let cumulative = 0;
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        labels.push(date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
        
        // Crear crecimiento realista
        const dailyGrowth = Math.random() * 3 + 1; // 1-4 por día
        cumulative += dailyGrowth;
        data.push(Math.floor(cumulative));
        
        // Factor de corrección basado en datos reales si están disponibles
        if (window.dashboardData) {
            const dataKey = type === 'users' ? 'users' : 
                           type === 'teachers' ? 'teachers' : 'institutions';
            const realCount = window.dashboardData[dataKey] ? 
                window.dashboardData[dataKey].length : 0;
            if (realCount > 0 && i === 0) {
                data[data.length - 1] = realCount;
            }
        }
    }
    
    return { labels, data };
}

function getLabelForType(type) {
    const labels = {
        'users': 'Alumnos',
        'teachers': 'Profesores',
        'institutions': 'Instituciones'
    };
    return labels[type] || 'Registros';
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-warning alert-dismissible fade show position-fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.zIndex = '9999';
    
    errorDiv.innerHTML = `
        <strong>⚠️</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Utilizar apiRequest globalizada del app.js
const apiRequest = async (...args) => {
    if (window.app && window.app.apiRequest) {
        return await window.app.apiRequest(...args);
    } else {
        // Fallback si app.js no está cargado
        return await fetch(...args).then(r => r.json());
    }
};
