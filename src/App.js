import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const startEditTask = (id) => {
    setEditTaskId(id);
    const taskToEdit = tasks.find(task => task.id === id);
    setEditText(taskToEdit.text);
  };

  const handleEditTask = () => {
    setTasks(tasks.map(task => (task.id === editTaskId ? { ...task, text: editText } : task)));
    setEditTaskId(null);
    setEditText('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'active':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  };

  const sortTasks = (key) => {
    const sortedTasks = [...tasks].sort((a, b) => (a[key] < b[key] ? -1 : 1));
    setTasks(sortedTasks);
  };

  return (
    <div className="container my-3">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTask}>Add Task</button>
      </div>
      <div className="btn-group mb-3">
        <button className="btn btn-secondary" onClick={() => setFilter('all')}>All</button>
        <button className="btn btn-secondary" onClick={() => setFilter('completed')}>Completed</button>
        <button className="btn btn-secondary" onClick={() => setFilter('active')}>Active</button>
        <button className="btn btn-secondary" onClick={() => sortTasks('text')}>Sort by Name</button>
      </div>
      <ul className="list-group">
        {filteredTasks().map((task) => (
          <li key={task.id} className={`list-group-item ${task.completed ? 'list-group-item-success' : ''}`}>
            {task.text}
            <button className="btn btn-info btn-sm mx-2" onClick={() => toggleTaskCompletion(task.id)}>
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button className="btn btn-warning btn-sm mx-2" onClick={() => startEditTask(task.id)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editTaskId && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="btn-close" onClick={() => setEditTaskId(null)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditTaskId(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleEditTask}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 

export default App;
