const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = updatedText;

    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
}

function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(function(task) {
            return !task.completed;
        });
    }

    if (currentFilter === "completed") {
        return tasks.filter(function(task) {
            return task.completed;
        });
    }

    return tasks;
}

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        const message = document.createElement("li");
        message.className = "empty-message";
        message.textContent = "No tasks found.";
        taskList.appendChild(message);
    } else {
        filteredTasks.forEach(function(task) {
            const listItem = document.createElement("li");
            listItem.className = "task";

            if (task.completed) {
                listItem.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", function() {
                toggleTask(task.id);
            });

            const taskText = document.createElement("span");
            taskText.className = "task-text";
            taskText.textContent = task.text;

            const editButton = document.createElement("button");
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function() {
                editTask(task.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteTask(task.id);
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(taskText);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        });
    }

    updateTaskCount();
}

function updateTaskCount() {
    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    if (remainingTasks === 1) {
        taskCount.textContent = "1 task remaining";
    } else {
        taskCount.textContent = remainingTasks + " tasks remaining";
    }
}

addTaskBtn.addEventListener("click", createTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        createTask();
    }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

renderTasks();