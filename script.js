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
    typeNote(); // Start typing effect for the note
    typeWriter(); // Start typing effect for the header
};


let tasks = [];

function addTask(task, date, time) {
    const taskObj = { task, date, time, completed: false };
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
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        filteredTasks = tasks.filter(task => {
            const taskDate = new Date(`${task.date}T${task.time}`);
            return taskDate >= startOfWeek && taskDate <= endOfWeek;
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
            <span>${task.task} - ${formattedDateTime} - User ID: ${task.userId}</span>
            <div>
                <button class="complete-btn" onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
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


