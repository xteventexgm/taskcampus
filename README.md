# TaskCampus

## Descripción del proyecto
TaskCampus es una aplicación web para la gestión de tareas académicas. Permite a los estudiantes registrar, consultar, actualizar, eliminar y filtrar sus actividades, además de visualizar un resumen estadístico de su progreso. El desarrollo se basa en el enfoque Spec Driven Development y se implementó utilizando TypeScript, Tailwind CSS y persistencia mediante LocalStorage.

## Instalación del frontend
1. Clonar el repositorio: `git clone https://github.com/TU_USUARIO/taskcampus.git`
2. Navegar a la carpeta del proyecto: `cd taskcampus/frontend`
3. Instalar TypeScript globalmente (si no está instalado): `npm install -g typescript`
4. Compilar el código: `tsc`
5. Abrir `index.html` en el navegador (se recomienda usar **Live Server** para habilitar el entorno de ejecución).

## Instalación del backend
Debido a que el proyecto utiliza una arquitectura basada en cliente, la capa de persistencia se gestiona directamente en el navegador mediante el **LocalStorage**. No se requiere instalar ni ejecutar un entorno de Python o base de datos externa para el funcionamiento de esta versión.

## Endpoints disponibles
Al operar de forma local, la lógica de datos se gestiona a través de los siguientes métodos de la clase `TaskManager`:

- **Listar tareas:** `taskManager.getTasks()`
- **Registrar tarea:** `taskManager.addTask(tarea)`
- **Actualizar tarea:** `taskManager.updateTask(id, data)`
- **Eliminar tarea:** `taskManager.deleteTask(id)`
- **Obtener resumen:** Cálculo dinámico basado en filtros internos del cliente.

## Integrantes del grupo
- Steven