import React, {useState} from 'react';
import {v1} from 'uuid';

import './App.css';

import {Todolist} from './components/Todolist';
import {AddItemForm} from './components/AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {TaskPriorities, TaskStatuses, TaskType} from './api/todolist-api';
import {FilterValuesType, TodolistDomainType} from './state/todolists-reducer';

export type TasksStateType = {
    [key: string]: TaskType[]
}


const App = () => {
    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, setTodolists] = useState<TodolistDomainType[]>([
        {id: todolistId1, title: 'What to learn', filter: 'active', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'completed', addedDate: '', order: 0},
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {
                id: v1(), title: 'CSS&HTML', status: TaskStatuses.Completed, priority: TaskPriorities.Low,
                startDate: '', deadline: '', todoListId: todolistId1, order: 0, addedDate: '', description: ''
            },
        ],
        [todolistId2]: [
            {
                id: v1(), title: 'React', status: TaskStatuses.Completed, priority: TaskPriorities.Low,
                startDate: '', deadline: '', todoListId: todolistId2, order: 0, addedDate: '', description: ''
            },
        ],
    })

    const addTodolist = (title: string) => {
        let todolist: TodolistDomainType = {
            id: v1(),
            filter: 'all',
            title: title,
            addedDate: '',
            order: 0
        }

        setTodolists([todolist, ...todolists])
        setTasks({...tasks, [todolist.id]: []})
    }
    const removeTodolist = (todolistId: string) => {
        // remove todolist
        const filteredTodolist = todolists.filter(t => t.id !== todolistId)
        setTodolists([...filteredTodolist])

        // remove tasks from deleted todolist
        delete tasks[todolistId]
        setTasks({...tasks})
    }
    const changeTodolistTitle = (todolistId: string, title: string) => {
        setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: title} : el))
    }

    const removeTask = (todolistId: string, id: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== id)})

        // const todolistTasks = tasks[todolistId]
        // const filteredTasks = todolistTasks.filter(t => t.id !== id)
        // tasks[todolistId] = filteredTasks
        // setTasks({...tasks})

    }
    const addTask = (todolistId: string, title: string) => {
        const newTask = {
            id: v1(),
            title,
            status: TaskStatuses.Completed,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: todolistId,
            order: 0,
            addedDate: '',
            description: ''
        }
        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})

        // const todolistTasks = tasks[todolistId]
        // const newTasks = [newTask, ...todolistTasks]
        // tasks[todolistId] = newTasks
        // setTasks({...tasks})
    }
    const changeFilter = (todolistId: string, filter: FilterValuesType) => {
        // через map
        setTodolists(todolists.map(t => t.id === todolistId ? {...t, filter} : t))

        // через find
        // const todolist = todolists.find(t => t.id === todolistId)
        //  if (todolist) {
        //      todolist.filter = filter
        //      setTodolists([...todolists])
        //  }
    }
    const changeTaskStatus = (todolistId: string, taskId: string, status: TaskStatuses) => {
        // через map
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, status: status} : t)})

        // через find
        // const todolistTasks = tasks[todolistId]
        // const todolistTask = todolistTasks.find(t => t.id === taskId)
        // if (todolistTask) {
        //     todolistTask.isDone = taskStatus
        //     setTasks({...tasks})
        // }
    }
    const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(el => el.id === taskId ? {...el, title: title} : el)})
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(todolist => {

                            let filteredTasks = tasks[todolist.id]

                            if (todolist.filter === 'active') {
                                filteredTasks = filteredTasks.filter(el => el.status === TaskStatuses.New)
                            }
                            if (todolist.filter === 'completed') {
                                filteredTasks = filteredTasks.filter(el => el.status === TaskStatuses.Completed)
                            }

                            return (
                                <Grid item>
                                    <Paper style={{padding: '10px'}}>
                                        <Todolist key={todolist.id}
                                                  id={todolist.id}
                                                  title={todolist.title}
                                                  tasks={filteredTasks}
                                                  removeTodolist={removeTodolist}
                                                  changeTodolistTitle={changeTodolistTitle}
                                                  removeTask={removeTask}
                                                  changeFilter={changeFilter}
                                                  addTask={addTask}
                                                  changeTaskStatus={changeTaskStatus}
                                                  changeTaskTitle={changeTaskTitle}
                                                  filter={todolist.filter}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }</Grid>
            </Container>
        </div>
    );
}

export default App;
