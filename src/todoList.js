import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, InputBase, IconButton }  from '@material-ui/core'
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid'; // Grid version 1
import './todo.css';

function TodoList() {
  const [todoList, setTodoList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [recentDoneList, setRecentDoneList] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch the task data from the API on mount and on updates
  useEffect(() => {
    axios.get('/api/todo')
      .then(res => {
        setTodoList(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  // Add a new task to the Todo list
  const addTodoItem = (item) => {
    axios.get('/api/todo', { item })
      .then(res => {
        setTodoList([...todoList, item]);
      })
      .catch(err => console.log(err));
  };

  // Move a task from the Todo list to the Done list
  const deleteTodoItem = (item) => {
    axios.delete(`/api/todo/${item}`)
      .then(res => {
        setTodoList(todoList.filter(i => i !== item));
        setDoneList(doneList.filter(i => i !== item));
        setRecentDoneList(recentDoneList.filter(i => i !== item));
      })
      .catch(err => console.log(err));
  };

  // Move a task from the Done list to the Todo list
  const undoDoneItem = async (itemToUndo) => {
    try {
      const response = await axios.put("/api/tasks", {
        description: itemToUndo,
        done: false,
      });
      const undoneTask = response.data.task;
      setDoneList((prevList) =>
        prevList.filter((item) => item !== undoneTask.description)
      );
      setTodoList((prevList) => [...prevList, undoneTask.description]);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete all tasks from the API
  const deleteAllTasks = () => {
    const confirmation = window.prompt('Are you sure you want to delete all tasks? Type "yes" to confirm.');
    if (confirmation === 'yes') {
      axios.delete('/api/todo?confirmation=yes')
        .then(res => {
          setTodoList([]);
          setDoneList([]);
          setRecentDoneList([]);
        })
        .catch(err => console.log(err));
    }
  };

  // Filter the Todo and Done lists based on the search text
  const filterTodoList = () => {
    if (!searchText) {
      return todoList;
    }
    return todoList.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
  };

  const filterDoneList = () => {
    if (!searchText) {
      return doneList;
    }
    return doneList.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
  };

  // Complete a task by select it
  const completeTodoItem = (item) => {
    axios.put(`/api/todo/${item}`)
      .then(res => {
        setTodoList(todoList.filter(i => i !== item));
        setDoneList([item, ...doneList]);
        setRecentDoneList([item, ...recentDoneList.slice(0, 9)]);
      })
      .catch(err => console.log(err));
  };


  return (
    <div>
      <div className="background">
        {/* https://codepen.io/sarazond/pen/LYGbwj */}
        {/* <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css'></link>
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div> */}
      </div>

      <div className="todo-list">
        <h1 className="title">Todo List</h1>
        <div className="btn-delete-box" >
          <Button type="submit" onClick={() => deleteAllTasks()} variant="outlined" color="primary" size="medium" className="btn-delete">Delete All</Button>
        </div>
        <Grid container spacing={2}>
          <Grid xs={8}>
            <div className="input-add-box">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTodoItem(e.target.newItem.value);
                  e.target.newItem.value = "";
                }}
              >
              <input type="text" name="newItem" placeholder="Add new task" />
              <Button type="submit"  variant="contained" color="primary" className="btn-add">Add</Button>
             </form>
          </div>
          </Grid>
          <Grid xs={4}>
            <Button>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search todo ... "
                inputProps={{ 'aria-label': 'search google maps' }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Button>
          
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={5}>
            <div>
              <h2>Todo:</h2>
              <ul>
                {todoList.map((item, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="checkbox"
                        onClick={() => completeTodoItem(item)}
                      />
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>
          <Grid xs={5}>
          <div>
            <h2>Done:</h2>
              <ul>
                {doneList.map((item, index) => (
                  <li key={index}>
                    <label>
                      <input type="checkbox" onClick={() => undoDoneItem(item)} />
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
              {/* <h2>Recently Completed:</h2>
              <ul>
                {recentDoneList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul> */}
            </div>
          </Grid>
        </Grid>        
      </div>
    </div>
  );
}

export default TodoList;