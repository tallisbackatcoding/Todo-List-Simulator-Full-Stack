import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import styles from './Content.module.css'
import TaskList from './TaskList/TaskList'
import {getAndSetTaskList, addTodo, updateTask, deleteTask} from './../../redux/taskReducer' 


const Content = (props)=>{
    let textInput = React.createRef();

    const handleInput=(e)=>{
        if(e.current.value){
            props.addTodo(e.current.value)
            e.current.value = "";
        }else{
            alert("todo can't be empty");
        }
    }

    if (!props.isAuth){
        return <Redirect to="login"/>
    }

    return (
        <div className = {styles.Content}>
            <input ref={textInput} type="text"/>
            <button onClick = {()=>handleInput(textInput)}>Add</button>
            <TaskList {...props}/>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
        isAuth: state.auth.isAuth,
        uncompletedTasks: state.list.uncompletedTasks,
        completedTasks: state.list.completedTasks
    }
}

export default connect(mapStateToProps, {getAndSetTaskList, addTodo, updateTask, deleteTask})(Content);