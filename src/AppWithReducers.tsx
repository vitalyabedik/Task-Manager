import React, {useReducer} from 'react';

import './App.css';

import {Todolist} from './components/Todolist';
import {v1} from 'uuid';
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
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from './state/todolists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './state/tasks-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from './api/todolist-api';

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type FilterType = 'all' | 'active' | 'completed'

export const AppWithReducers = () => {
    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'active', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'completed', addedDate: '', order: 0},
    ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {
                id: v1(), title: 'CSS&HTML', status: TaskStatuses.Completed, priority: TaskPriorities.Low,
                startDate: '', deadline: '', todoListId: todolistId1, order: 0, addedDate: '', description: ''
            }
        ],
        [todolistId2]: [
            {
                id: v1(), title: 'CSS&HTML', status: TaskStatuses.Completed, priority: TaskPriorities.Low,
                startDate: '', deadline: '', todoListId: todolistId2, order: 0, addedDate: '', description: ''
            }
        ],
    })

    const addTodolist = (title: string) => {
        const action = addTodolistAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }
    const removeTodolist = (todolistId: string) => {
        const action = removeTodolistAC(todolistId)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }
    const changeTodolistTitle = (todolistId: string, title: string) => {
        dispatchToTodolists(changeTodolistTitleAC(todolistId, title))
    }

    const changeFilter = (todolistId: string, filter: FilterType) => {
        dispatchToTodolists(changeTodolistFilterAC(todolistId, filter))
    }

    const removeTask = (todolistId: string, id: string) => {
        dispatchToTasks(removeTaskAC(todolistId, id))
    }

    const addTask = (todolistId: string, title: string) => {
        dispatchToTasks(addTaskAC(todolistId, title))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, status: TaskStatuses) => {
        dispatchToTasks(changeTaskStatusAC(todolistId, taskId, status))
    }

    const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
        dispatchToTasks(changeTaskTitleAC(todolistId, taskId, title))
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


