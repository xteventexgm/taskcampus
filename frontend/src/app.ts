// 1. Definir los tipos basados en los requisitos de la práctica
type Prioridad = "baja" | "media" | "alta"; // [cite: 24]
type Estado = "pendiente" | "en proceso" | "finalizada"; // [cite: 25]

interface Tarea {
  id: string;
  titulo: string; // [cite: 20]
  descripcion: string; // [cite: 21]
  asignatura: string; // [cite: 22]
  fechaEntrega: string; // [cite: 23]
  prioridad: Prioridad; // [cite: 24]
  estado: Estado; // [cite: 25]
}

// 2. Clase para manejar el LocalStorage
class TaskManager {
  private tasks: Tarea[] = [];
  private readonly STORAGE_KEY = "taskcampus_tasks";

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.tasks = JSON.parse(stored);
    }
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  public addTask(tarea: Omit<Tarea, "id">): void {
    const newTask: Tarea = {
      ...tarea,
      id: crypto.randomUUID(), // Genera un ID único para cada tarea
    };
    this.tasks.push(newTask);
    this.saveTasks();
    console.log("Tarea guardada:", newTask);
  }

  public getTasks(): Tarea[] {
    return this.tasks;
  }
}

const taskManager = new TaskManager();

// 3. Lógica del DOM
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm") as HTMLFormElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capturar los valores del formulario
    const titulo = (document.getElementById("titulo") as HTMLInputElement)
      .value;
    const descripcion = (
      document.getElementById("descripcion") as HTMLTextAreaElement
    ).value;
    const asignatura = (
      document.getElementById("asignatura") as HTMLInputElement
    ).value;
    const fechaEntrega = (
      document.getElementById("fechaEntrega") as HTMLInputElement
    ).value;
    const prioridad = (
      document.getElementById("prioridad") as HTMLSelectElement
    ).value as Prioridad;
    const estado = (document.getElementById("estado") as HTMLSelectElement)
      .value as Estado;

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
