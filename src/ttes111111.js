import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


  useEffect(() => {
    axios.get('/api/todos')
      .then(response => {
        const todos = response.data;
        const todoTasks = todos.filter(task => !task.completed).sort((a, b) => a.text.localeCompare(b.text));
        const doneTasks = todos.filter(task => task.completed).sort((a, b) => b.id.localeCompare(a.id)).slice(0, 10);
        setTodoList(todoTasks);
        setDoneList(doneTasks);
      })
      .catch(error => console.log(error));
  }, []);

  function handleNewTaskSubmit(event) {
    event.preventDefault();
    if (newTask.trim() === '') {
      return;
    }
    axios.post('/api/todos', { text: newTask.trim(), completed: false })
      .then(response => {
        setTodoList([...todoList, response.data].sort(compareTasks));
        setNewTask('');
      })
      .catch(error => {
        console.log(error);
      });
  }

  function handleTaskCheck(task) {
    axios.patch(`/api/todos/${task.id}`, { completed: !task.completed })
      .then(response => {
        const updatedTask = response.data;
        const updatedTodoList = todoList.filter(task => task.id !== updatedTask.id);
        const updatedDoneList = [...doneList, updatedTask].sort(compareTasks).slice(-10);
        if (updatedTask.completed) {
          setTodoList(updatedTodoList);
          setDoneList(updatedDoneList);
        } else {
          setDoneList(doneList.filter(task => task.id !== updatedTask.id));
          setTodoList([...updatedTodoList, updatedTask].sort(compareTasks));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function handleDeleteAllTasks() {
    setShowConfirmDelete(false);
    axios.delete('/api/todos')
      .then(() => {
        setTodoList([]);
        setDoneList([]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleTaskAdd = (value) => {
    console.log(value)
    if (newTaskText.trim() === '') {
      return;
    }
    const newTask = { text: newTaskText, completed: false };
    axios.post('/api/todos', newTask)
      .then(response => {
        const addedTask = response.data;
        setTodoList([...todoList, addedTask]);
        setNewTaskText('');
      })
      .catch(error => console.log(error));
  };

  // const handleTaskCheck = (task) => {
  //   const updatedTask = { ...task, completed: !task.completed };
  //   axios.patch(`/api/todos/${task.id}`, updatedTask)
  //     .then(response => {
  //       const updatedTask = response.data;
  //       const updatedTodoList = todoList.filter(task => task.id !== updatedTask.id);
  //       const updatedDoneList = doneList.filter(task => task.id !== updatedTask.id);
  //       if (updatedTask.completed) {
  //         setDoneList([updatedTask, ...updatedDoneList].slice(0, 10));
  //       } else {
  //         setTodoList([...updatedTodoList, updatedTask]);
  //       }
  //     })
  //     .catch(error => console.log(error));
  // };

  // const handleDeleteAllTasks = () => {
  //   axios.delete('/api/todos')
  //     .then(() => {
  //       setTodoList([]);
  //       setDoneList([]);
  //       setShowConfirmDelete(false);
  //     })
  //     .catch(error => console.log(error));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiUrl, { item: newItem });
      setTodoList((prevTodoList) => [...prevTodoList, response.data]);
      setNewItem("");
    } catch (error) {
      console.error(error);
    }
  };

  return () {
    <div className="TodoList">
      <h1>Todo List</h1>
      <div className="search">
        <input type="text" value={searchText} onChange={handleSearchChange} placeholder="Search..." />
      </div>
      <div className="lists">
        <div className="todo">
          <h2>To Do</h2>
          <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
            />
            <button type="submit">Add</button>
            </form>
          <ul>
            {todoList.filter(task => task.text.toLowerCase().includes(searchText.toLowerCase())).map(task => (
              <li key={task.id}>
                <input type="checkbox" checked={task.completed} onChange={() => handleTaskCheck(task)} />
                {task.text}
              </li>
            ))}
          </ul>
          <button className="delete-all" onClick={() => setShowConfirmDelete(true)}> Delete all tasks </button>
          {showConfirmDelete && (
            <div className="confirm-delete">
              <p>Are you sure you want to delete all tasks?</p>
              <button className="confirm" onClick={handleDeleteAllTasks}>Yes</button>
              <button className="cancel" onClick={() => setShowConfirmDelete(false)}>No</button>
            </div>
          )}
        </div>
        <div className="done">
          <h2>Done</h2>
          <ul>
            {doneList.filter(task => task.text.toLowerCase().includes(searchText.toLowerCase())).map(task => (
              <li key={task.id}>
                <input type="checkbox" checked={task.completed} onChange={() => handleTaskCheck(task)} />
                {task.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
}


export default TodoList;