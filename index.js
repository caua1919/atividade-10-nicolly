const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const taskDueDateInput = document.getElementById("task-due-date");
const taskPriorityInput = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const filterBtn = document.getElementById("filter-btn");

let tasks = [];
let filterState = 'all'; // 'all', 'completed', 'pending'

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const taskName = taskNameInput.value.trim();
    const taskDueDate = taskDueDateInput.value;
    const taskPriority = taskPriorityInput.value;
    
    if (taskName && taskDueDate) {
        const task = {
            name: taskName,
            dueDate: taskDueDate,
            priority: taskPriority,
            completed: false
        };
        
        tasks.push(task);
        renderTasks();
        taskForm.reset();
    }
});

filterBtn.addEventListener("click", () => {
    if (filterState === 'all') {
        filterState = 'completed';
        filterBtn.textContent = "Filtrar Pendentes";
    } else if (filterState === 'completed') {
        filterState = 'pending';
        filterBtn.textContent = "Filtrar Todos";
    } else {
        filterState = 'all';
        filterBtn.textContent = "Filtrar Concluídas";
    }
    renderTasks();
});

function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    if (filterState === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filterState === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");

        const taskDate = new Date(task.dueDate);
        const today = new Date();
        const isUrgent = taskDate - today < 24 * 60 * 60 * 1000;

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''} ${isUrgent ? 'urgent' : ''} ${priorityClass(task.priority)}">
                ${task.name} - ${task.dueDate}
            </span>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${index})">
            <button onclick="editTask(${index})">Editar</button>
            <button onclick="deleteTask(${index})">Deletar</button>
        `;

        taskList.appendChild(li);
    });
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function editTask(index) {
    const task = tasks[index];
    taskNameInput.value = task.name;
    taskDueDateInput.value = task.dueDate;
    taskPriorityInput.value = task.priority;

    taskForm.removeEventListener("submit", handleSubmit);
    taskForm.addEventListener("submit", (e) => handleEditSubmit(e, index));
}

function handleEditSubmit(e, index) {
    e.preventDefault();

    tasks[index].name = taskNameInput.value.trim();
    tasks[index].dueDate = taskDueDateInput.value;
    tasks[index].priority = taskPriorityInput.value;

    taskForm.reset();
    renderTasks();

    taskForm.removeEventListener("submit", handleEditSubmit);
    taskForm.addEventListener("submit", handleSubmit);
}

function priorityClass(priority) {
    if (priority === 'alta') return 'high-priority';
    if (priority === 'media') return 'medium-priority';
    return 'low-priority';
}
