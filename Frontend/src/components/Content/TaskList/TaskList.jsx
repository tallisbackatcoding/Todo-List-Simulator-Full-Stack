import React, { useEffect, useState} from 'react';
import { connect } from 'react-redux';
import CustomCheckbox from '../../common/CustomCheckbox';
import styles from './TaskList.module.css'
import {AiFillDelete} from "react-icons/ai"

const TaskList = (props)=>{
    
    let [disabledTasks, setDisabledTasks] = useState(new Set())
    
    const sendAndUpdateTask = (task)=>{
        if (disabledTasks.has(task.id)){
            return;
        }
        let disabledTasksCopy = new Set(disabledTasks)
        disabledTasksCopy.add(task.id)
        setDisabledTasks(disabledTasksCopy)
        props.updateTask(task).then(()=>{
            disabledTasksCopy = new Set(disabledTasks)
            disabledTasksCopy.delete(task.id)
            setDisabledTasks(disabledTasksCopy)
        });
    }
    const deleteAndUpdateTask = (task)=>{
        if (disabledTasks.has(task.id)){
            return;
        }
        let disabledTasksCopy = new Set(disabledTasks)
        disabledTasksCopy.add(task.id)
        setDisabledTasks(disabledTasksCopy)
        props.deleteTask(task).then(()=>{
            disabledTasksCopy = new Set(disabledTasks)
            disabledTasksCopy.delete(task.id)
            setDisabledTasks(disabledTasksCopy)
        });
        
    } 

    useEffect(() => {
        if(props.uncompletedTasks.length === 0 && props.completedTasks.length === 0 && props.isAuth){
            props.getAndSetTaskList()
        }
        if(!props.isAuth && (props.uncompletedTasks.length > 0 || props.completedTasks.length > 0)){
            props.getAndSetTaskList()
        }
    }, [props.tasks])
    
    let uncompletedTasks = props.uncompletedTasks.map(task => {
        return (
            <div>
                <div className = {styles.todoItemBox}>
                    <div className = {styles.todoItem}>
                        <span>{task.todo}</span>
                    </div>
                </div>
                <span className={styles.customCheckbox} onClick={(e)=>{
                    e.preventDefault();
                    sendAndUpdateTask({...task, completed: !task.completed});
                    }}><CustomCheckbox checked={false}/></span> 
            </div>  
    )})
    let completedTasks = props.completedTasks.map(task => {
        return (
            <div >
                <div className = {styles.todoItemBox}>
                    <div className = {styles.todoItem}>
                        <span className={styles.checked}>{task.todo}</span>
                        <AiFillDelete className={styles.deleteIcon} onClick={()=>{
                            deleteAndUpdateTask(task);
                        }}/>
                    </div>
                </div>
                <span className={styles.customCheckbox} onClick={(e)=>{
                    e.preventDefault();
                    sendAndUpdateTask({...task, completed: !task.completed});
                    }}><CustomCheckbox checked={true}/></span>
                
            </div>  
    )})
    return (
        <div className={styles.taskList}>
            {uncompletedTasks}
            {completedTasks}
        </div>
    )
}


export default TaskList;