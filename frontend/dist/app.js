// 2. Clase para manejar el LocalStorage
class TaskManager {
    constructor() {
        this.tasks = [];
        this.STORAGE_KEY = "taskcampus_tasks";
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
        console.log("Tarea guardada:", newTask);
    }
    getTasks() {
        return this.tasks;
    }
}
const taskManager = new TaskManager();
// 3. Lógica del DOM
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("taskForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // Capturar los valores del formulario
        const titulo = document.getElementById("titulo")
            .value;
        const descripcion = document.getElementById("descripcion").value;
        const asignatura = document.getElementById("asignatura").value;
        const fechaEntrega = document.getElementById("fechaEntrega").value;
        const prioridad = document.getElementById("prioridad").value;
        const estado = document.getElementById("estado")
            .value;
        // Guardar la tarea
        taskManager.addTask({
            titulo,
            descripcion,
            asignatura,
            fechaEntrega,
            prioridad,
            estado,
        });
        // Limpiar el formulario y dar feedback
        form.reset();
        alert("¡Tarea registrada con éxito!");
    });
});
export {};
//# sourceMappingURL=app.js.map