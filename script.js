const form = document.getElementById("toDoList");
const taskList = document.getElementById("taskList");
console.log(taskList);
const historyList = document.getElementById("historyList");

const currentTime = new Date().toLocaleString();

const ACTIONS = {
  ADD: "add",
  DELETE: "delete",
  EDIT: "edit",
};

function showToDoList() {
  const allTasks = JSON.parse(localStorage.getItem("userTasks")) || [];

  for (let i = 0; i < allTasks.length; i++) {
    let taskItem = document.createElement("li");
    taskItem.textContent = allTasks[i].taskText;
    taskItem.setAttribute("id", allTasks[i].taskID);
    taskList.appendChild(taskItem);
  }
}
function showLastToDoElement() {
  const allTasks = JSON.parse(localStorage.getItem("userTasks"));
  let taskItem = document.createElement("li");
  taskItem.textContent = allTasks[allTasks.length - 1].taskText;
  taskItem.setAttribute("id", allTasks[allTasks.length - 1].taskID);
  taskList.appendChild(taskItem);
  console.log(allTasks);
}

function workWithHistory(newHistoryItem) {
  let history = [];
  let storedHistory = localStorage.getItem("tasksHistory");
  if (storedHistory) {
    history = JSON.parse(storedHistory);
  } else {
    console.log("Немає збереженої історії завдань.");
  }

  const updatedHistory = [...history, newHistoryItem];
  localStorage.setItem("tasksHistory", JSON.stringify(updatedHistory));
  console.log("Історія завдань оновлена в localStorage.");

  // Додаємо історію завдань на сторінку в Список історії
  showLastHistoryList();
}

function getNewHistoryItem(action, id, time, text, newText = null) {
  let newHistoryItem = {
    action: action,
    taskID: id,
    taskText: text,
    time: time,
    message: null,
  };
  if (action === ACTIONS.ADD) {
    newHistoryItem.message = `Завдання "${text}" з ID ${id} було додано до списку.`;
  } else if (action === ACTIONS.DELETE) {
    newHistoryItem.message = `Завдання "${text}" з ID ${id} було видалено зі списку.`;
  } else if (action === ACTIONS.EDIT) {
    newHistoryItem.message = `Завдання "${text}" з ID ${id} було відредаговано на "${newText}".`;
  }
  console.log(newHistoryItem);

  return newHistoryItem;
}

function showHistoryList() {

    historyList.innerHTML = ""; // Очистка списку історії перед додаванням нових елементів
  const allHistory = JSON.parse(localStorage.getItem("tasksHistory")) || [];
  console.log(allHistory);

  for (let i = allHistory.length - 1; i >= 0; i--) {
    let historyItem = document.createElement("p");
    historyItem.textContent = allHistory[i].message;
    historyList.appendChild(historyItem);
  }
}

function showLastHistoryList() {
  const allHistory = JSON.parse(localStorage.getItem("tasksHistory")) || [];
  let historyItem = document.createElement("p");
  historyItem.textContent = allHistory[allHistory.length - 1].message;
  historyList.prepend(historyItem);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  //взяття даних з localStorage
  let tasks = [];
  let lastId = 0;
  let storedTasks = localStorage.getItem("userTasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    if (tasks.length > 0) {
      lastId = tasks[tasks.length - 1].taskID;
    }
  } else {
    console.log("Немає збережених завдань.");
  }
  //   console.log(tasks.length);
  //   console.log(JSON.stringify(tasks));

  //Закінчення блоку взяття даних з localStorage

  // Додаємо таску до масиву та зберігаємо в localStorage
  let input = document.getElementById("taskInput").value;
  let newTask = {};
  if (input) {
    // console.log("ok");

    newTask = {
      taskID: lastId + 1,
      taskText: input,
    };

    // МИ конкатенуємо два масиви
    const createdTasks = [...tasks, newTask];
    localStorage.setItem("userTasks", JSON.stringify(createdTasks));
    form.reset();
    alert("Завдання додано до списку!");
  } else {
    alert("Поле не може бути пустим!");
    return;
  }
  // Закінчення блоку додавання таски до масиву та зберігаємо в localStorage

  //   Створюємо масив до історії завдань, беремо дані з localStorage, конкатенуємо масиви та зберігаємо в localStorage

  let newHistoryItem = getNewHistoryItem(
    ACTIONS.ADD,
    newTask.taskID,
    currentTime,
    newTask.taskText,
  );

  workWithHistory(newHistoryItem);

  // Додаємо останню таску на сторінку в Список завдань
  showLastToDoElement();
});

// Видалення таски зі списку та localStorage
taskList.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const clickedTask = event.target;
  //   console.log(clickedTask);
  const clickedTaskId = event.target.id;
  //   console.log(clickedTaskId);
  const clickedTaskText = event.target.textContent;
  taskList.removeChild(clickedTask);

  // Видаляємо таску з localStorage
  const allTasks = JSON.parse(localStorage.getItem("userTasks"));

  //   Тут ми фільтруємо масив завдань, залишаючи лише ті, ID яких не співпадає з ID видаленої таски. Це створює новий масив, який містить всі завдання, крім видаленої таски.
  const tasksAfterDeletion = allTasks.filter((task) => {
    // console.log(typeof task.taskID);
    // console.log(typeof clickedTaskId);
    return task.taskID !== Number(clickedTaskId);
  });
  console.log(tasksAfterDeletion);
  localStorage.setItem("userTasks", JSON.stringify(tasksAfterDeletion));
  console.log("Завдання видалено з localStorage.");
  let newHistoryItem = getNewHistoryItem(
    ACTIONS.DELETE,
    clickedTaskId,
    currentTime,
    clickedTaskText,
  );
  workWithHistory(newHistoryItem);
});

// Редагування таски зі списку та localStorage
taskList.addEventListener("click", (event) => {
  event.preventDefault();
  const clickedTask = event.target;
  const clickedTaskId = event.target.id;
  const clickedTaskText = event.target.textContent;
  console.log(clickedTaskText);

  const newTaskText = prompt(
    "Введіть новий текст завдання:",
    clickedTask.textContent,
  );
//   if (newTaskText) {
    if (newTaskText === null) {
      return;
    } else {
      clickedTask.textContent = newTaskText;
    }
//   }
  console.log(clickedTask.textContent);

  // Редагуємо таску в localStorage
  const allTasks = JSON.parse(localStorage.getItem("userTasks"));

  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].taskID === Number(clickedTaskId)) {
      allTasks[i].taskText = newTaskText;
      break;
    }
  }
  localStorage.setItem("userTasks", JSON.stringify(allTasks));
  console.log("Завдання відредаговано в localStorage.");

  let newHistoryItem = getNewHistoryItem(
    ACTIONS.EDIT,
    clickedTaskId,
    currentTime,
    clickedTaskText,
    newTaskText,
  );
  workWithHistory(newHistoryItem);
});

// Додаємо таски на сторінку в Список завдань
showToDoList();
// // Додаємо історію завдань на сторінку в Список історії
showHistoryList();

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem("tasksHistory");
  showHistoryList();
});
