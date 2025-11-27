// State Management
let activeTasks = [];
let completedTasks = [];
const MAX_TASKS = 10;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const showCompletedBtn = document.getElementById('showCompletedBtn');
const completedModal = document.getElementById('completedModal');
const closeModal = document.getElementById('closeModal');
const completedList = document.getElementById('completedList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');

// Initialize App
async function init() {
  const data = await window.electronAPI.loadData();
  activeTasks = data.activeTasks || [];
  completedTasks = data.completedTasks || [];
  
  renderTasks();
  updateCounters();
  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  showCompletedBtn.addEventListener('click', showCompletedModal);
  closeModal.addEventListener('click', hideCompletedModal);
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);
  
  minimizeBtn.addEventListener('click', () => {
    window.electronAPI.minimizeApp();
  });
  
  closeBtn.addEventListener('click', () => {
    window.electronAPI.closeApp();
  });
  
  // Modal außerhalb schließen
  completedModal.addEventListener('click', (e) => {
    if (e.target === completedModal) {
      hideCompletedModal();
    }
  });
}

// Add Task
function addTask() {
  const text = taskInput.value.trim();
  
  if (!text) {
    taskInput.focus();
    return;
  }
  
  if (activeTasks.length >= MAX_TASKS) {
    alert(`Maximal ${MAX_TASKS} Tasks erlaubt. Bitte erledige erst eine Aufgabe.`);
    return;
  }
  
  const newTask = {
    id: Date.now(),
    text: text,
    createdAt: new Date().toISOString()
  };
  
  activeTasks.push(newTask);
  taskInput.value = '';
  
  saveData();
  renderTasks();
  updateCounters();
  taskInput.focus();
}

// Complete Task
function completeTask(taskId) {
  const taskIndex = activeTasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) return;
  
  const task = activeTasks[taskIndex];
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  
  // Animation
  taskElement.classList.add('completing');
  
  setTimeout(() => {
    // Task in completed verschieben
    completedTasks.unshift({
      ...task,
      completedAt: new Date().toISOString()
    });
    
    // Aus active Tasks entfernen
    activeTasks.splice(taskIndex, 1);
    
    saveData();
    renderTasks();
    updateCounters();
  }, 300);
}

// Edit Task
function editTask(taskId) {
  const task = activeTasks.find(t => t.id === taskId);
  if (!task) return;
  
  const taskElement = document.querySelector(`[data-task-id="${taskId}"] .task-text`);
  const currentText = task.text;
  
  // Mache Text editierbar
  taskElement.contentEditable = true;
  taskElement.classList.add('editing');
  taskElement.focus();
  
  // Cursor ans Ende setzen
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(taskElement);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  
  // Bei Enter speichern
  taskElement.addEventListener('keydown', function onEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit();
    }
    if (e.key === 'Escape') {
      taskElement.textContent = currentText;
      finishEdit();
    }
  });
  
  // Bei Klick außerhalb speichern
  taskElement.addEventListener('blur', finishEdit);
  
  function finishEdit() {
    const newText = taskElement.textContent.trim();
    
    if (newText && newText !== currentText) {
      task.text = newText;
      saveData();
    } else if (!newText) {
      taskElement.textContent = currentText;
    }
    
    taskElement.contentEditable = false;
    taskElement.classList.remove('editing');
    renderTasks();
  }
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = '';
  
  if (activeTasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        Keine Aufgaben vorhanden.<br>
        Füge eine neue Aufgabe hinzu!
      </div>
    `;
    return;
  }
  
  activeTasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-task-id', task.id);
    
    taskItem.innerHTML = `
      <div class="checkbox-circle" data-task-id="${task.id}"></div>
      <div class="task-text" data-task-id="${task.id}">${escapeHtml(task.text)}</div>
    `;
    
    const checkbox = taskItem.querySelector('.checkbox-circle');
    checkbox.addEventListener('click', () => completeTask(task.id));
    
    const taskText = taskItem.querySelector('.task-text');
    taskText.addEventListener('dblclick', () => editTask(task.id));
    
    taskList.appendChild(taskItem);
  });
}

// Update Counters
function updateCounters() {
  taskCount.textContent = `${activeTasks.length}/${MAX_TASKS}`;
  completedCount.textContent = completedTasks.length;
  
  // Add Button Status
  if (activeTasks.length >= MAX_TASKS) {
    addBtn.disabled = true;
    taskInput.disabled = true;
  } else {
    addBtn.disabled = false;
    taskInput.disabled = false;
  }
}

// Show Completed Modal
function showCompletedModal() {
  renderCompletedTasks();
  completedModal.classList.add('show');
}

// Hide Completed Modal
function hideCompletedModal() {
  completedModal.classList.remove('show');
}

// Render Completed Tasks
function renderCompletedTasks() {
  completedList.innerHTML = '';
  
  if (completedTasks.length === 0) {
    completedList.innerHTML = `
      <div class="empty-state">
        Noch keine Aufgaben erledigt.
      </div>
    `;
    return;
  }
  
  completedTasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'completed-task';
    
    const completedDate = new Date(task.completedAt).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    taskItem.innerHTML = `
      <div>
        <div>${escapeHtml(task.text)}</div>
        <div class="completed-date">${completedDate}</div>
      </div>
    `;
    
    completedList.appendChild(taskItem);
  });
}

// Clear Completed Tasks
function clearCompletedTasks() {
  if (completedTasks.length === 0) return;
  
  if (confirm('Möchtest du wirklich alle erledigten Aufgaben löschen?')) {
    completedTasks = [];
    saveData();
    renderCompletedTasks();
    updateCounters();
  }
}

// Save Data
async function saveData() {
  await window.electronAPI.saveData({
    activeTasks,
    completedTasks
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Start App
init();
