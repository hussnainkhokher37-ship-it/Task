// TOOL JAVASCRIPT - Update with progress circle

// ===== TASK TRACKER TOOL =====
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    const pendingTasksSpan = document.getElementById('pendingTasks');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressBar = document.querySelector('.progress-bar');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize
    renderTasks();
    updateStats();
    updateProgressCircle();
    
    // Add Task
    addBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({
                id: Date.now(),
                text: taskText,
                completed: false
            });
            saveTasks();
            taskInput.value = '';
            renderTasks();
            updateStats();
            updateProgressCircle();
        }
    });
    
    // Add task with Enter key
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });
    
    // Toggle task completion
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        updateStats();
        updateProgressCircle();
    }
    
    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
        updateProgressCircle();
    }
    
    // Clear all tasks
    clearAllBtn.addEventListener('click', function() {
        if (tasks.length > 0 && confirm('Clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
            updateStats();
            updateProgressCircle();
        }
    });
    
    // Render tasks
    function renderTasks() {
        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="empty-state">No tasks yet. Add your first task above!</li>';
            return;
        }
        
        taskList.innerHTML = tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-check">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as complete">
                </div>
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="delete-task" aria-label="Delete task">×</button>
            </li>
        `).join('');
        
        // Add event listeners to checkboxes and delete buttons
        document.querySelectorAll('.task-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const checkbox = item.querySelector('input[type="checkbox"]');
            const deleteBtn = item.querySelector('.delete-task');
            
            checkbox.addEventListener('change', () => toggleTask(id));
            deleteBtn.addEventListener('click', () => deleteTask(id));
        });
    }
    
    // Update statistics
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        pendingTasksSpan.textContent = pending;
    }
    
    // Update progress circle
    function updateProgressCircle() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        progressPercentage.textContent = percentage;
        
        // Calculate circle circumference (2 * π * r = 2 * 3.14 * 45 = 283)
        const circumference = 283;
        const offset = circumference - (percentage / 100) * circumference;
        
        if (progressBar) {
            progressBar.style.strokeDashoffset = offset;
        }
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});