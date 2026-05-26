"use strict";
class TaskManager {
    constructor() {
        this.tasks = [];
        this.STORAGE_KEY = 'taskcampus_tasks';
        this.loadTasks();
    }
    loadTasks() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.tasks = JSON.parse(stored);
        }
    }
    saveTasks() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    }
    addTask(tarea) {
        const newTask = Object.assign(Object.assign({}, tarea), { id: crypto.randomUUID() });
        this.tasks.push(newTask);
        this.saveTasks();
    }
    getTasks() {
        return this.tasks;
    }
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }
    updateTask(id, updatedData) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = Object.assign(Object.assign({}, updatedData), { id });
            this.saveTasks();
        }
    }
}
const taskManager = new TaskManager();
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const submitBtn = form.querySelector('button[type="submit"]');
    // Elementos del Filtro
    const filtroEstado = document.getElementById('filtroEstado');
    const filtroPrioridad = document.getElementById('filtroPrioridad');
    const filtroAsignatura = document.getElementById('filtroAsignatura');
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
    // Elementos del Resumen
    const resTotal = document.getElementById('resTotal');
    const resPendientes = document.getElementById('resPendientes');
    const resFinalizadas = document.getElementById('resFinalizadas');
    const resAlta = document.getElementById('resAlta');
    let editingTaskId = null;
    // Actualiza las tarjetas de números
    const updateSummary = () => {
        const tasks = taskManager.getTasks();
        resTotal.textContent = tasks.length.toString();
        resPendientes.textContent = tasks.filter(t => t.estado === 'pendiente').length.toString();
        resFinalizadas.textContent = tasks.filter(t => t.estado === 'finalizada').length.toString();
        resAlta.textContent = tasks.filter(t => t.prioridad === 'alta').length.toString();
    };
    const renderTasks = () => {
        taskList.innerHTML = '';
        let tasks = taskManager.getTasks();
        // Aplicar los Filtros
        const estadoFilter = filtroEstado.value;
        const prioridadFilter = filtroPrioridad.value;
        const asignaturaFilter = filtroAsignatura.value.toLowerCase().trim();
        if (estadoFilter !== 'todos') {
            tasks = tasks.filter(t => t.estado === estadoFilter);
        }
        if (prioridadFilter !== 'todos') {
            tasks = tasks.filter(t => t.prioridad === prioridadFilter);
        }
        if (asignaturaFilter) {
            tasks = tasks.filter(t => t.asignatura.toLowerCase().includes(asignaturaFilter));
        }
        // Actualizar estadísticas globales
        updateSummary();
        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="text-gray-500 col-span-2 text-center py-4">No se encontraron tareas con estos criterios.</p>';
            return;
        }
        tasks.forEach(tarea => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded shadow border border-gray-200 flex flex-col justify-between hover:shadow-md transition';
            const colorPrioridad = tarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold text-gray-800 break-words">${tarea.titulo}</h3>
                        <span class="text-xs font-semibold px-2 py-1 rounded ${colorPrioridad} shrink-0">${tarea.prioridad}</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-1"><span class="font-semibold">Asignatura:</span> ${tarea.asignatura}</p>
                    <p class="text-sm text-gray-600 mb-2"><span class="font-semibold">Entrega:</span> ${tarea.fechaEntrega}</p>
                    <p class="text-gray-700 text-sm mb-4 break-words">${tarea.descripcion || 'Sin descripción'}</p>
                </div>
                <div class="mt-auto border-t pt-3 flex justify-between items-center">
                    <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">${tarea.estado}</span>
                    <div class="space-x-3">
                        <button class="text-blue-500 hover:text-blue-700 text-sm font-semibold btn-editar transition" data-id="${tarea.id}">Editar</button>
                        <button class="text-red-500 hover:text-red-700 text-sm font-semibold btn-eliminar transition" data-id="${tarea.id}">Eliminar</button>
                    </div>
                </div>
            `;
            taskList.appendChild(card);
        });
        // Eventos Eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (id && confirm('¿Estás seguro de eliminar esta tarea?')) {
                    taskManager.deleteTask(id);
                    renderTasks();
                }
            });
        });
        // Eventos Editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (id) {
                    const task = taskManager.getTasks().find(t => t.id === id);
                    if (task) {
                        document.getElementById('titulo').value = task.titulo;
                        document.getElementById('descripcion').value = task.descripcion;
                        document.getElementById('asignatura').value = task.asignatura;
                        document.getElementById('fechaEntrega').value = task.fechaEntrega;
                        document.getElementById('prioridad').value = task.prioridad;
                        document.getElementById('estado').value = task.estado;
                        editingTaskId = id;
                        submitBtn.textContent = 'Actualizar Tarea';
                        submitBtn.classList.replace('bg-blue-600', 'bg-green-600');
                        submitBtn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            });
        });
    };
    // Listeners para los filtros (actualizan la vista al cambiar)
    filtroEstado.addEventListener('change', renderTasks);
    filtroPrioridad.addEventListener('change', renderTasks);
    filtroAsignatura.addEventListener('input', renderTasks);
    // Botón para limpiar filtros
    btnLimpiarFiltros.addEventListener('click', () => {
        filtroEstado.value = 'todos';
        filtroPrioridad.value = 'todos';
        filtroAsignatura.value = '';
        renderTasks();
    });
    renderTasks();
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const asignatura = document.getElementById('asignatura').value;
        const fechaEntrega = document.getElementById('fechaEntrega').value;
        const prioridad = document.getElementById('prioridad').value;
        const estado = document.getElementById('estado').value;
        const taskData = { titulo, descripcion, asignatura, fechaEntrega, prioridad, estado };
        if (editingTaskId) {
            taskManager.updateTask(editingTaskId, taskData);
            editingTaskId = null;
            submitBtn.textContent = 'Guardar Tarea';
            submitBtn.classList.replace('bg-green-600', 'bg-blue-600');
            submitBtn.classList.replace('hover:bg-green-700', 'hover:bg-blue-700');
        }
        else {
            taskManager.addTask(taskData);
        }
        form.reset();
        renderTasks();
    });
});
