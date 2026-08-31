const STORAGE_KEY = "my-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const locationInput = document.querySelector("#location-input");
const priorityInput = document.querySelector("#priority-input");
const amountInput = document.querySelector("#amount-input");
const unitInput = document.querySelector("#unit-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const formMessage = document.querySelector("#form-message");
const completedCount = document.querySelector("#completed-count");
const incompleteCount = document.querySelector("#incomplete-count");
const taskTotal = document.querySelector("#task-total");
const listTitle = document.querySelector("#list-title");
const viewDateInput = document.querySelector("#view-date");

let selectedDate = getLocalDate();
let tasks = sortTasksByPriority(loadTasks());

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks.map((task) => ({ ...task, date: task.date || getLocalDate() })) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();
  const visibleTasks = sortTasksByPriority(tasks.filter((task) => task.date === selectedDate));

  visibleTasks.forEach((task) => {
    const taskRow = document.createElement("li");
    taskRow.className = `task-row${task.completed ? " completed" : ""}`;
    taskRow.dataset.taskId = task.id;
    taskRow.dataset.priority = task.priority || "medium";

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";
    taskContent.append(taskText);

    const priorityLabel = document.createElement("span");
    priorityLabel.className = `priority-label priority-${task.priority || "medium"}`;
    priorityLabel.textContent = `${task.priority || "medium"} priority`;
    taskContent.append(priorityLabel);

    if (task.location) {
      const taskLocation = document.createElement("span");
      taskLocation.className = "task-location";
      taskLocation.textContent = `At ${task.location}`;
      taskContent.append(taskLocation);
    }

    if (task.amount !== undefined && task.amount !== "" && task.unit) {
      const taskMeasurement = document.createElement("span");
      taskMeasurement.className = "task-measurement";
      taskMeasurement.textContent = `${task.amount} ${task.unit}`;
      taskContent.append(taskMeasurement);

        const progress = Math.max(Number(task.progress) || 0, 0);
      const progressSection = document.createElement("div");
      progressSection.className = "progress-section";

      const percentage = Math.round((progress / Number(task.amount)) * 100);
      const progressHeader = document.createElement("div");
      progressHeader.className = "progress-header";
      const progressText = document.createElement("span");
      progressText.textContent = `${percentage}% complete`;
      const progressLabel = document.createElement("label");
      progressLabel.append("Progress ");
      const progressInput = document.createElement("input");
      progressInput.className = "progress-input";
      progressInput.type = "number";
      progressInput.min = "0";
      progressInput.step = "any";
      progressInput.value = progress;
      progressInput.setAttribute("aria-label", `Progress for ${task.text}`);
      progressLabel.append(progressInput, ` ${task.unit}`);
      progressHeader.append(progressText, progressLabel);

      const progressTrack = document.createElement("div");
      progressTrack.className = "progress-track";
      progressTrack.setAttribute("role", "progressbar");
      progressTrack.setAttribute("aria-valuemin", "0");
      progressTrack.setAttribute("aria-valuemax", task.amount);
      progressTrack.setAttribute("aria-valuenow", progress);
      progressTrack.setAttribute("aria-label", `Progress for ${task.text}`);
      const progressBar = document.createElement("div");
      progressBar.className = "progress-bar";
        progressBar.style.width = `${Math.min((progress / Number(task.amount)) * 100, 100)}%`;
      progressTrack.append(progressBar);
      progressSection.append(progressHeader, progressTrack);
      taskContent.append(progressSection);
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.innerHTML = "&times;";

    taskRow.append(checkbox, taskContent, deleteButton);
    taskList.append(taskRow);
  });

  const completed = visibleTasks.filter((task) => task.completed).length;
  completedCount.textContent = completed;
  incompleteCount.textContent = visibleTasks.length - completed;
  taskTotal.textContent = `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;
  listTitle.textContent = selectedDate === getLocalDate() ? "Today’s list" : `Tasks for ${formatDate(selectedDate)}`;
  emptyState.textContent = selectedDate === getLocalDate() ? "Your task list is clear. Add something to get started." : "No tasks saved for this date.";
  emptyState.hidden = visibleTasks.length > 0;
}

function addTask() {
  const text = taskInput.value.trim();
  const location = locationInput.value.trim();
  const priority = priorityInput.value;
  const amount = amountInput.value.trim();
  const unit = unitInput.value;
  formMessage.textContent = "";

  if (!text) {
    formMessage.textContent = "Please enter a task before adding it.";
    taskInput.focus();
    return;
  }

  if ((amount && !unit) || (!amount && unit)) {
    formMessage.textContent = "Add both an amount and a unit, or leave both blank.";
    if (!amount) amountInput.focus();
    else unitInput.focus();
    return;
  }

  if (amount && Number(amount) <= 0) {
    formMessage.textContent = "The goal must be greater than zero.";
    amountInput.focus();
    return;
  }

  tasks.unshift({ id: crypto.randomUUID(), text, location, amount, unit, progress: "0", priority, date: getLocalDate(), completed: false });
  tasks = sortTasksByPriority(tasks);
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

viewDateInput.value = selectedDate;
viewDateInput.addEventListener("change", () => {
  selectedDate = viewDateInput.value || getLocalDate();
  renderTasks();
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

taskList.addEventListener("input", (event) => {
  if (!event.target.matches(".progress-input")) return;
  const taskRow = event.target.closest(".task-row");
  const task = tasks.find((item) => item.id === taskRow.dataset.taskId);
  if (!task) return;

    const progress = Math.max(Number(event.target.value) || 0, 0);
  task.progress = String(progress);
  event.target.value = progress;
  const percentage = (progress / Number(task.amount)) * 100;
    taskRow.querySelector(".progress-header > span").textContent = `${Math.round(percentage)}% complete`;
  const progressTrack = taskRow.querySelector(".progress-track");
  progressTrack.setAttribute("aria-valuenow", progress);
    progressTrack.querySelector(".progress-bar").style.width = `${Math.min(percentage, 100)}%`;
  saveTasks();
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

function getLocalDate() {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localToday.toISOString().split("T")[0];
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function sortTasksByPriority(taskItems) {
  const priorityRank = { high: 3, medium: 2, low: 1 };
  return taskItems
    .map((task, index) => ({ task, index }))
    .sort((first, second) => {
      const firstRank = priorityRank[first.task.priority] || priorityRank.medium;
      const secondRank = priorityRank[second.task.priority] || priorityRank.medium;
      return secondRank - firstRank || first.index - second.index;
    })
    .map(({ task }) => task);
}