const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const readTasks = () => {
  try {
    const data = fs.readFileSync('tasks.json');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading tasks.json:', err);
    return [];
  }
};

const writeTasks = (tasks) => {
  try {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Error writing to tasks.json:', err);
  }
};

app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.render('tasks', { tasks });
});

app.get('/task', (req, res) => {
  const taskId = parseInt(req.query.id);
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    res.render('task', { task });
  } else {
    res.status(404).send('Task not found');
  }
});

app.get('/add-task', (req, res) => {
  res.render('addTask');
});

app.post('/add-task', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.redirect('/tasks');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});