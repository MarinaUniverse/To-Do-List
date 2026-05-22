const form = document.getElementById("toDoList");
const taskList = document.getElementById("taskList");
console.log(taskList);
const historyList = document.getElementById("historyList");

const currentTime = new Date().toLocaleString();

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

  function workingWithHistory() {

  }


function getNewHistoryItem(action, id, time) {
  let newHistoryItem = {
    action: action,
    taskID: id,
    time: time,
    message: `Завдання з ID ${id} було ${action === ACTIONS.ADD ? "додано" : action === ACTIONS.DELETE ? "видалено" : "відредаговано"}. Час дії: ${time}`,
  };
  console.log(newHistoryItem);
  
  return newHistoryItem;
}

const ACTIONS = {
  ADD: "add",
  DELETE: "delete",
  EDIT: "edit",
};



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
  if (input) {
    // console.log("ok");

    let newTask = {
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
  
  workingWithHistory()
  
  let history = [];
  let storedHistory = localStorage.getItem("tasksHistory");
  if (storedHistory) {
    history = JSON.parse(storedHistory);
  } else {
    console.log("Немає збереженої історії завдань.");
  }

  let newHistoryItem = getNewHistoryItem(ACTIONS.ADD, newTask.taskID, currentTime);

  // Додаємо останню таску на сторінку в Список завдань
  showLastToDoElement();
});
// Додаємо таски на сторінку в Список завдань
showToDoList();

// Видалення таски зі списку та localStorage
taskList.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const clickedTask = event.target;
  //   console.log(clickedTask);
  const clickedTaskId = event.target.id;
  //   console.log(clickedTaskId);
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
  let newHistoryItem = getNewHistoryItem(ACTIONS.DELETE, clickedTaskId, currentTime);
});

// Редагування таски зі списку та localStorage
taskList.addEventListener("click", (event) => {
  event.preventDefault();
  const clickedTask = event.target;
  const clickedTaskId = event.target.id;

  const newTaskText = prompt(
    "Введіть новий текст завдання:",
    clickedTask.textContent,
  );
  if (newTaskText) {
    clickedTask.textContent = newTaskText;
  }
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
  let newHistoryItem = getNewHistoryItem(ACTIONS.EDIT, clickedTaskId, currentTime);
});
