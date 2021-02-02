import axios from "axios";
import { store } from 'react-notifications-component';

const tooManyRequestsDangerNotification=()=>{
    store.addNotification({
        title: "Too many requests!",
        message: "Please wait",
        type: "danger",
        container: "top-right",
        insert: "top",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    })
}

const instance = axios.create({
    withCredentials: true,
    baseURL:'http://localhost:8080/'
})

export const AuthAPI = {
    me(){
        return instance.get('auth/me').then(response => {
            return response.data;
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    },
    login(username, password){
        return instance.post('auth/login',{username, password}).then(response =>{
            return response.data;
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    },
    logout(){
            return instance.delete('auth/logout').then(response => {
                return response.data;
            }).catch((e)=>{
                if( e.response && e.response.status === 429){
                    tooManyRequestsDangerNotification();
                    return e.response.data;
                }
            })
    },
    register(username, password){
        return instance.post('/auth/register', {username, password}).then(response => {
            return response.data;
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    },
    changeUsername(newUsername){
        return instance.patch('/auth/username', {newUsername}).then(response=> {
            return response.data;
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    },
    changePassword(oldPassword, newPassword){
        return instance.patch('/auth/password', {oldPassword, newPassword}).then(response=> {
            return response.data;
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    }
}

export const TaskAPI = {
    list(){
        return instance.get('task/list').then(response =>{
            return response.data;
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    },
    add(todo){
        return instance.post('task/add', {todo: todo, complete: false}).then(response => {
            return response.data
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    },
    update(task){
        return instance.put('task/update/' + task.id, task).then(response => {
            return response.data
        }).catch((e)=>{
            if( e.response &&  e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    },
    delete(task){
        return instance.delete('task/delete/' + task.id).then(response => {
            return response.data
        }).catch((e)=>{
            if( e.response && e.response.status === 429){
                tooManyRequestsDangerNotification();
                return e.response.data;
            }
        })
    }
}


export const AdminAPI={
    allUsers(){
        return instance.get('admin/users').then(response=>response.data);
    }
}