const STORAGE_KEY = 'todo-app-tasks';

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks(tasks) {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach(function (task, index) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' is-completed' : '');

    li.innerHTML =
      '<label class="task-item__check-area">' +
        '<input type="checkbox" class="task-item__checkbox"' + (task.completed ? ' checked' : '') + '>' +
        '<span class="task-item__checkmark"></span>' +
      '</label>' +
      '<span class="task-item__text">' + task.text + '</span>' +
      '<div class="task-item__actions">' +
        '<button type="button" class="btn btn--edit">編集</button>' +
        '<button type="button" class="btn btn--danger">削除</button>' +
      '</div>';

    li.querySelector('.task-item__checkbox')
      .addEventListener('change', function () { toggleTask(index); });

    li.querySelector('.btn--edit')
      .addEventListener('click', function () { editTask(index); });

    li.querySelector('.btn--danger')
      .addEventListener('click', function () { deleteTask(index); });

    list.appendChild(li);
  });

  const total = tasks.length;
  const completed = tasks.filter(function (t) { return t.completed; }).length;
  document.getElementById('task-count').textContent =
    total + '件中 ' + completed + '件完了';
}

// 初期表示
const tasks = loadTasks();
renderTasks(tasks);

function deleteTask(index) {
  const tasks = loadTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks(tasks);
}

function toggleTask(index) {
  const tasks = loadTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks(tasks);
}

function editTask(index) {
  const li = document.getElementById('task-list').children[index];
  const textSpan = li.querySelector('.task-item__text');
  const editBtn = li.querySelector('.btn--edit');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-form__input';
  input.value = textSpan.textContent;
  li.replaceChild(input, textSpan);

  editBtn.textContent = '保存';
  const newEditBtn = editBtn.cloneNode(true);
  editBtn.replaceWith(newEditBtn);
  newEditBtn.addEventListener('click', function () {
    saveEditTask(index, input.value);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') saveEditTask(index, input.value);
  });
  input.focus();
}

function saveEditTask(index, newText) {
  const text = newText.trim();
  if (!text) return;

  const tasks = loadTasks();
  tasks[index].text = text;
  saveTasks(tasks);
  renderTasks(tasks);
}

function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) return;

  const tasks = loadTasks();
  tasks.push({ text: text, completed: false });
  saveTasks(tasks);
  renderTasks(tasks);
  input.value = '';
}

document.querySelector('.task-form__button')
  .addEventListener('click', addTask);

document.getElementById('task-input')
  .addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });
