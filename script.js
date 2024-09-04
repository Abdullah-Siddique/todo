const noteText = "Note your daily activities and works.";
let noteIndex = 0;
const noteSpeed = 100; // Typing speed in milliseconds

function typeNote() {
    if (noteIndex < noteText.length) {
        document.getElementById("note").innerHTML += noteText.charAt(noteIndex);
        noteIndex++;
        setTimeout(typeNote, noteSpeed);
    }
}

window.onload = function() {
    typeNote(); // Start typing effect for the note
    typeWriter(); // Start typing effect for the header
};


let tasks = [];

function addTask(task, date, time) {
    const taskObj = { task, date, time, completed: false };
    tasks.push(taskObj);
    renderTasks(tasks);
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks(tasks);
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
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
            return taskDate > new Date(today.setDate(startOfWeek)) && taskDate < new Date(today.setDate(startOfWeek + 7));
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
                <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });
}

document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('task-input').value;
    const dateInput = document.getElementById('date-input').value;
    const timeInput = document.getElementById('time-input').value;
    
    if (taskInput && dateInput && timeInput) {
        addTask(taskInput, dateInput, timeInput);
    }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterTasks(e.target.dataset.filter);
    });
});

