let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let isWorkMode = true;

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({
            text: text,
            completed: false,
            id: Date.now()
        });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${index})">
                <button class="delete-btn" onclick="deleteTask(${index})">X</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkMode = true;
    timeLeft = 25 * 60;
    updateDisplay();
}

function updateTimer() {
    timeLeft--;
    updateDisplay();
    
    if (timeLeft <= 0) {
        isWorkMode = !isWorkMode;
        timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
        updateDisplay();
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    document.getElementById('timer').textContent = display;
    
    const modeElement = document.getElementById('mode');
    modeElement.textContent = isWorkMode ? 'Work Time' : 'Break Time';
    
    if (isWorkMode) {
        document.getElementById('timer').style.color = '#27ae60';
    } else {
        document.getElementById('timer').style.color = '#e67e22';
    }
}

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

window.onload = function() {
    renderTasks();
};
