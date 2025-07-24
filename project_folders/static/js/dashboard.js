const viewContainer = document.querySelector(".taskView");
const listView = document.getElementById("list-view");
const boardView = document.getElementById("board-view");
const tasklistPending = document.getElementById("tasks-list-pink");
const tasklistInProgress = document.getElementById("tasks-list-green");
const tasklistCompleted = document.getElementById("tasks-list-blue");
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const tasklistPendingBoard = document.getElementById("board-list-pink");
const tasklistInProgressBoard = document.getElementById("board-list-green");
const tasklistCompletedBoard = document.getElementById("board-list-blue");
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const progressList = ["To Do", "Doing", "Done"];
const addTaskForm = document.getElementById("add-task-form");
const nameField = document.getElementById("name");
const descriptionField = document.getElementById("description");
const dateField = document.getElementById("due-date-day");
const monthField = document.getElementById("due-date-month");
const yearField = document.getElementById("due-date-year");
let pendingCount = 0;
let InProgressCount = 0;
let completedCount = 0;
let pendingCountBoard = 0;
let InProgressCountBoard = 0;
let completedCountBoard = 0;
let task_result;

// the current active overlay (need to come back to this after this to study)
let activeOverlay = null;

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/tasks")
    .then((res) => res.json())
    .then((tasks) => {
      task_result = tasks;
      renderListView(tasks); // default to list views
      // setupToggleButtons(tasks); // to switch between views
    });
});

// add task
addTaskCTA.addEventListener("click", () => {
  setTaskOverlay.classList.remove("hide");
  activeOverlay = setTaskOverlay;
  // disable scrolling for content behind the overlay
  document.body.classList.add("overflow-hidden");
});

addTaskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = nameField.value.trim();
  const desc = descriptionField.value.trim();
  const day = parseInt(dateField.value);
  const month = parseInt(monthField.value);
  const year = parseInt(yearField.value);
  const errorBox = document.getElementById("errorMsg");
  const selectedStatus = document.querySelector(
    'input[name="status-option"]:checked'
  );

  errorBox.textContent = "";

  if (!title || !desc || !day || !month || !year) {
    errorBox.textContent = "Please fill in all fields.";
    return;
  }

  if (!selectedStatus) {
    errorBox.textContent = "No status is selected.";
  }

  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2025) {
    errorBox.textContent = "Please enter a valid date.";
    return;
  }

  const dueDate = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  console.log(dueDate);
});

// radio buttons for view option
radioViewOptions.forEach((radioButton) => {
  radioButton.addEventListener("change", (event) => {
    const eventTarget = event.target;
    const viewOption = eventTarget.value;

    switch (viewOption) {
      case "list":
        boardView.classList.add("hide");
        listView.classList.remove("hide");
        break;
      case "board":
        listView.classList.add("hide");
        boardView.classList.remove("hide");
        if (
          tasklistCompletedBoard.innerHTML == "" &&
          tasklistInProgressBoard.innerHTML == "" &&
          tasklistPendingBoard.innerHTML == ""
        ) {
          renderBoardView(task_result);
        }
        break;
    }
  });
});

function renderListView(tasks) {
  tasks.forEach((task) => {
    if (task.status === "Pending") {
      pendingCount += 1;
      tasklistPending.innerHTML += `
        <li class="task-item" id = pending-item${pendingCount}>
          <button class="task-button">
            <p class="task-name">${task.title}</p>
            <p class="task-description">${task.description}</P>
            <p class="task-due-date">Due on ${task.due_date}</p>
            <!-- arrow -->
            <iconify-icon
              icon="material-symbols:arrow-back-ios-rounded"
              style="color: black"
              width="18"
              height="18"
              class="arrow-icon">
            </iconify-icon>
          </button> 
        </li>
      `;
    }
    if (task.status === "In Progress") {
      InProgressCount += 1;
      tasklistInProgress.innerHTML += `
        <li class="task-item" id = in-progress-item${InProgressCount}>
          <button class="task-button">
            <p class="task-name">${task.title}</p>
            <p class="task-description">${task.description}</P>
            <p class="task-due-date">Due on ${task.due_date}</p>
            <!-- arrow -->
            <iconify-icon
              icon="material-symbols:arrow-back-ios-rounded"
              style="color: black"
              width="18"
              height="18"
              class="arrow-icon">
            </iconify-icon>
          </button> 
        </li>
      `;
    }
    if (task.status === "Completed") {
      completedCount += 1;
      tasklistCompleted.innerHTML += `
        <li class="task-item" id = completed-item${completedCount}>
          <button class="task-button">
            <p class="task-name">${task.title}</p>
            <p class="task-description">${task.description}</P>
            <p class="task-due-date">Due on ${task.due_date}</p>
            <!-- arrow -->
            <iconify-icon
              icon="material-symbols:arrow-back-ios-rounded"
              style="color: black"
              width="18"
              height="18"
              class="arrow-icon">
            </iconify-icon>
          </button> 
        </li>
      `;
    }
  });
}

function renderBoardView(tasks) {
  tasks.forEach((task) => {
    if (task.status === "Pending") {
      pendingCountBoard += 1;
      tasklistPendingBoard.innerHTML += `
        <li class="task-item" id = pending-item-board${pendingCountBoard}>
            <button class="task-button">
              <div>
                <p class="task-name">${task.title}</p>
                <p class="task-description">${task.description}</P>
                <p class="task-due-date">Due on ${task.due_date}</p>
              </div>
              <!-- arrow -->
              <iconify-icon
                icon="material-symbols:arrow-back-ios-rounded"
                style="color: black"
                width="18"
                height="18"
                class="arrow-icon"
              ></iconify-icon>
            </button>
        </li>
      `;
    }
    if (task.status === "In Progress") {
      InProgressCountBoard += 1;
      tasklistInProgressBoard.innerHTML += `
        <li class="task-item" id = in-progress-item-board${InProgressCountBoard}>
            <button class="task-button">
              <div>
                <p class="task-name">${task.title}</p>
                <p class="task-description">${task.description}</P>
                <p class="task-due-date">Due on ${task.due_date}</p>
              </div>
              <!-- arrow -->
              <iconify-icon
                icon="material-symbols:arrow-back-ios-rounded"
                style="color: black"
                width="18"
                height="18"
                class="arrow-icon"
              ></iconify-icon>
            </button>
        </li>
      `;
    }
    if (task.status === "Completed") {
      completedCountBoard += 1;
      tasklistCompletedBoard.innerHTML += `
        <li class="task-item" id = completed-item-board${completedCountBoard}>
            <button class="task-button">
              <div>
                <p class="task-name">${task.title}</p>
                <p class="task-description>${task.description}</P>
                <p class="task-due-date">Due on ${task.due_date}</p>
              </div>
              <!-- arrow -->
              <iconify-icon
                icon="material-symbols:arrow-back-ios-rounded"
                style="color: black"
                width="18"
                height="18"
                class="arrow-icon"
              ></iconify-icon>
            </button>
        </li>
      `;
    }
  });
}
