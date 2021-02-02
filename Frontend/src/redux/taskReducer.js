import { TaskAPI } from "../api/api"

const UPDATE_TASKS = 'UPDATE_TASKS';
const UPDATE_ONE_TASK = 'UPDATE_ONE_TASK';
const ADD_TASK = 'ADD_TASK';
const DELETE_TASK = 'DELETE_TASK';

let initialState = {
    completedTasks: [],
    uncompletedTasks: []
}

export const updateTasks = (tasks)=>({type:UPDATE_TASKS, tasks})
const addTask = (task)=>({type:ADD_TASK, task})
const updateTaskAC = (task)=>({type:UPDATE_ONE_TASK, task})
const deleteTaskAC = (task)=>({type:DELETE_TASK, task})

const taskReducer = (state = initialState, action) =>{
    if (!action){
        return state
    }
    switch(action.type){
        case UPDATE_TASKS:
            return {...state, completedTasks:[...action.tasks.completedTasks], uncompletedTasks:[...action.tasks.uncompletedTasks]}
        case ADD_TASK:
            return {...state, uncompletedTasks:[...state.uncompletedTasks, action.task]}
        case UPDATE_ONE_TASK:
            if (action.task.completed === true){
                let tempTasks = [...state.uncompletedTasks]
                tempTasks = tempTasks.filter((task)=>{
                    if (task.id !== action.task.id){
                        return true;
                    }
                    return false;
                })
                return {...state, completedTasks: [...state.completedTasks, {...action.task}], uncompletedTasks: tempTasks}
            }else{
                let tempTasks = [...state.completedTasks]
                tempTasks = tempTasks.filter((task)=>{
                    if (task.id !== action.task.id){
                        return true;
                    }
                    return false;
                })
                return {...state, completedTasks: tempTasks, uncompletedTasks: [...state.uncompletedTasks, {...action.task}]}
            }
        case DELETE_TASK:
            let tempTasks = [...state.completedTasks]
            tempTasks = tempTasks.filter((task)=>{
                if (task.id !== action.task.id){
                    return true;
                }
                return false;
            })
            return {...state, completedTasks: tempTasks}
        default:
            return state
    }
}

export const getAndSetTaskList = (completed = null)=>{
    return (dispatch)=>{
        return TaskAPI.list().then(data=>{
            let returnData = data
            if(returnData.completedTasks || returnData.uncompletedTasks){
                dispatch(updateTasks(returnData));
            }
            
        })
    }
}

export const addTodo = (todo)=>{
    return (dispatch)=>{
        return TaskAPI.add(todo).then(data=>{
            if (data.successCode === 0){
                const returndedTask = data.task
                dispatch(addTask(returndedTask))
            }
        })
    }
}

export const updateTask = (task)=>{
    return (dispatch)=>{
        return TaskAPI.update(task).then(data=>{
            if (data.successCode === 0){
                const returndedTask = data.task
                dispatch(updateTaskAC(returndedTask))
            }
        })
    }
}

export const deleteTask = (task)=>{
    return (dispatch)=>{
        return TaskAPI.delete(task).then(data=>{
            if (data.successCode === 0){
                dispatch(deleteTaskAC({...task}))
            }
        })
    }
}

export default taskReducer;