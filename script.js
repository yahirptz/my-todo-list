const STORAGE_KEY = "my-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const formMessage = document.querySelector("#form-message");
const completedCount = document.querySelector("#completed-count");
const incompleteCount = document.querySelector("#incomplete-count");
const taskTotal = document.querySelector("#task-total");

let tasks = loadTasks();

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task) => {
    const taskRow = document.createElement("li");
    taskRow.className = `task-row${task.completed ? " completed" : ""}`;
    taskRow.dataset.taskId = task.id;

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.innerHTML = "&times;";

    taskRow.append(checkbox, taskText, deleteButton);
    taskList.append(taskRow);
  });

  const completed = tasks.filter((task) => task.completed).length;
  completedCount.textContent = completed;
  incompleteCount.textContent = tasks.length - completed;
  taskTotal.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  emptyState.hidden = tasks.length > 0;
}

function addTask() {
  const text = taskInput.value.trim();
  formMessage.textContent = "";

  if (!text) {
    formMessage.textContent = "Please enter a task before adding it.";
    taskInput.focus();
    return;
  }

  tasks.unshift({ id: crypto.randomUUID(), text, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

taskList.addEventListener("change", (event) => {
  if (!event.target.matches(".task-checkbox")) return;
  const taskRow = event.target.closest(".task-row");
  const task = tasks.find((item) => item.id === taskRow.dataset.taskId);
  if (!task) return;
  task.completed = event.target.checked;
  saveTasks();
  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('[data-action="delete"]');
  if (!deleteButton) return;
  const taskRow = deleteButton.closest(".task-row");
  tasks = tasks.filter((task) => task.id !== taskRow.dataset.taskId);
  saveTasks();
  renderTasks();
});

renderTasks();