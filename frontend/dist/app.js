"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
const taskManager = new TaskManager();
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    // Función para dibujar las tareas
    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = taskManager.getTasks();
        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="text-gray-500 col-span-2">No hay tareas registradas aún.</p>';
            return;
        }
        tasks.forEach(tarea => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded shadow border border-gray-200 flex flex-col justify-between';
            const colorPrioridad = tarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold text-gray-800">${tarea.titulo}</h3>
                        <span class="text-xs font-semibold px-2 py-1 rounded ${colorPrioridad}">${tarea.prioridad}</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-1"><span class="font-semibold">Asignatura:</span> ${tarea.asignatura}</p>
                    <p class="text-sm text-gray-600 mb-2"><span class="font-semibold">Entrega:</span> ${tarea.fechaEntrega}</p>
                    <p class="text-gray-700 text-sm mb-4">${tarea.descripcion || 'Sin descripción'}</p>
                </div>
                <div class="mt-auto border-t pt-2 flex justify-between items-center">
                    <span class="text-xs font-bold text-blue-600 uppercase">${tarea.estado}</span>
                </div>
            `;
            taskList.appendChild(card);
        });
    };
    // Dibujar tareas iniciales
    renderTasks();
    // Evento al guardar el formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const asignatura = document.getElementById('asignatura').value;
        const fechaEntrega = document.getElementById('fechaEntrega').value;
        const prioridad = document.getElementById('prioridad').value;
        const estado = document.getElementById('estado').value;
        taskManager.addTask({
            titulo,
            descripcion,
            asignatura,
            fechaEntrega,
            prioridad,
            estado
        });
        form.reset();
        renderTasks(); // Actualiza la lista al instante
    });
});
//# sourceMappingURL=app.js.map