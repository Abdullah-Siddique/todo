const noteText = "Note your daily activities and works.";
let noteIndex = 0;
const noteSpeed = 100;

function typeNote() {
    if (noteIndex < noteText.length) {
        document.getElementById("note").innerHTML += noteText.charAt(noteIndex);
        noteIndex++;
        setTimeout(typeNote, noteSpeed);
    }
}

window.onload = function() {
    typeNote();
    loadTasks();

    // Check if userId exists in localStorage and display it
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
        document.getElementById('user-id-display').innerText = `Your ID: ${savedUserId}`;
    }
};

// Unique ID Generator
function generateUniqueId(name) {
    return name + '-' + Math.floor(Math.random() * 1000000);
}

document.getElementById('get-id-btn').addEventListener('click', () => {
    const userName = document.getElementById('user-name').value;
    if (userName) {
        const userId = generateUniqueId(userName);
        document.getElementById('user-id-display').innerText = `Your ID: ${userId}`;
        localStorage.setItem('userId', userId); // Store user ID in localStorage
    }
});

// Task Management System
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask(task, date, time) {
    const userId = localStorage.getItem('userId') || 'Anonymous'; // Get user ID from localStorage or use 'Anonymous'
    const taskObj = { task, date, time, completed: false, userId };
    tasks.push(taskObj);
    saveTasks();
    renderTasks(tasks);
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(tasks);
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks(tasks);
}

function filterTasks(criteria) {
    const today = new Date();
    let filteredTasks = [];

    if (criteria === 'today') {
        filteredTasks = tasks.filter(task => {
            const taskDate = new Date(`${task.date}T${task.time}`);
            return taskDate.toDateString() === today.toDateString();
        });
    } else if (criteria === 'week') {
        const startOfWeek = today.getDate() - today.getDay();
        filteredTasks = tasks.filter(task => {
            const taskDate = new Date(`${task.date}T${task.time}`);
            return taskDate >= new Date(today.setDate(startOfWeek)) && taskDate <= new Date(today.setDate(startOfWeek + 7));
        });
    } else if (criteria === 'month') {
        filteredTasks = tasks.filter(task => {
            const taskDate = new Date(`${task.date}T${task.time}`);
            return taskDate.getMonth() === today.getMonth();
        });
    }

    renderTasks(filteredTasks);
}

function renderTasks(taskArray) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    taskArray.forEach((task, index) => {
        const taskDateTime = new Date(`${task.date}T${task.time}`);
        const formattedDateTime = taskDateTime.toLocaleString();

        const taskItem = document.createElement('li');
        taskItem.className = 'task-item' + (task.completed ? ' completed' : '');

        taskItem.innerHTML = `
            <span>${task.task} - ${formattedDateTime}</span>
            <div>
                <button class="complete-btn" onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });
}

// Stylish buttons with hover effects
document.addEventListener("DOMContentLoaded", () => {
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        .complete-btn {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .complete-btn:hover {
            background-color: #218838;
        }

        .delete-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .delete-btn:hover {
            background-color: #c82333;
        }

        .task-item.completed span {
            text-decoration: line-through;
            color: #6c757d;
        }
    `;
    document.head.appendChild(styleSheet);
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks);
}

document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('task-input').value;
    const dateInput = document.getElementById('date-input').value;
    const timeInput = document.getElementById('time-input').value;
    
    if (taskInput && dateInput && timeInput) {
        addTask(taskInput, dateInput, timeInput);
        document.getElementById('task-input').value = ''; // Clear input after adding task
        document.getElementById('date-input').value = '';
        document.getElementById('time-input').value = '';
    }
});

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterTasks(filter);
    });
});




