// assets/js/main.js - Complete JavaScript with Tool

// ===== DOM Elements =====
document.addEventListener('DOMContentLoaded', function() {
    // Header elements
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const header = document.querySelector('header');
    
    // FAQ elements
    const details = document.querySelectorAll('details');
    
    // Tool elements
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    const pendingTasksSpan = document.getElementById('pendingTasks');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressBar = document.querySelector('.progress-bar');
    
    // ===== MOBILE MENU TOGGLE - FIXED =====
    if (hamburger && mobileMenu) {
        console.log('Hamburger found');
        
        // Initially hide menu
        mobileMenu.style.display = 'none';
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Hamburger clicked');
            
            const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
            this.setAttribute('aria-expanded', expanded);
            
            if (expanded) {
                mobileMenu.style.display = 'block';
                document.body.style.overflow = 'hidden';
                console.log('Menu opened');
            } else {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
                console.log('Menu closed');
            }
        });

        // Close on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767) {
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Close on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
            });
        });
    }

    // ===== TASK TRACKER TOOL =====
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize
    renderTasks();
    updateStats();
    updateProgressCircle();
    
    // Add Task
    if (addBtn && taskInput) {
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
    }
    
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
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (tasks.length > 0 && confirm('Clear all tasks?')) {
                tasks = [];
                saveTasks();
                renderTasks();
                updateStats();
                updateProgressCircle();
            }
        });
    }
    
    // Render tasks
    function renderTasks() {
        if (!taskList) return;
        
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
        
        // Add event listeners
        document.querySelectorAll('.task-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const checkbox = item.querySelector('input[type="checkbox"]');
            const deleteBtn = item.querySelector('.delete-task');
            
            if (checkbox) {
                checkbox.addEventListener('change', () => toggleTask(id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteTask(id));
            }
        });
    }
    
    // Update statistics
    function updateStats() {
        if (!totalTasksSpan || !completedTasksSpan || !pendingTasksSpan) return;
        
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        pendingTasksSpan.textContent = pending;
    }
    
    // Update progress circle
    function updateProgressCircle() {
        if (!progressPercentage || !progressBar) return;
        
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        progressPercentage.textContent = percentage;
        
        // Circle circumference (2 * π * r = 2 * 3.14 * 45 = 283)
        const circumference = 283;
        const offset = circumference - (percentage / 100) * circumference;
        progressBar.style.strokeDashoffset = offset;
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

    // ===== FAQ ACCORDION =====
    if (details.length > 0) {
        details.forEach(detail => {
            detail.addEventListener('toggle', function(e) {
                if (this.open) {
                    details.forEach(otherDetail => {
                        if (otherDetail !== this && otherDetail.open) {
                            otherDetail.open = false;
                        }
                    });
                }
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== ACTIVE LINK HIGHLIGHTING =====
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (linkPath === currentLocation || 
            (currentLocation === '/' && linkPath === '/')) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // ===== SCROLL TO TOP BUTTON =====
    if (!document.querySelector('.scroll-to-top')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.innerHTML = '↑';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary, #3b82f6);
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            font-size: 20px;
            z-index: 99;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(scrollBtn);
        
        window.addEventListener('scroll', function() {
            scrollBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        });
        
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

