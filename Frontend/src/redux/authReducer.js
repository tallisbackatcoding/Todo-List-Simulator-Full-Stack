import {AuthAPI} from "../api/api";
import {stopSubmit} from "redux-form";
import {updateTasks} from './taskReducer'
import { act } from "react-dom/test-utils";

const SET_USER_DATA = 'SET_USER_DATA';
const NEW_USERNAME = 'NEW_USERNAME';

let initialState = {
    id: null,
    username: null,
    email: null,
    isAuth: false,
    roles: ["ROLE_USER"]
}

const authReducer = (state = initialState, action) =>{
    if (!action){
        return state
    }
    switch(action.type){
        
        case SET_USER_DATA: {
            var isAuth = false
            isAuth = (action.data.username !== null);
            const userRoles = action.roles.map(role=>role.name); 
            return {...state, ...action.data, isAuth, roles: userRoles};
        }
        case NEW_USERNAME:
            return {...state, username: action.newUsername}
        default:
            return state
    }
}

const changeUsernameAC=(newUsername)=>{
    return {
        type: NEW_USERNAME,
        newUsername
    }
}

export const setUserData = (id, username, roles)=>({type:SET_USER_DATA, data:{id, username}, roles})

export const getAndSetUserData = () =>{
    return (dispatch)=>{
        return AuthAPI.me().then(data=>{
            let authData = data
            if (authData && authData.successCode === 0){
                dispatch(setUserData(authData.user.id, authData.user.username, authData.user.roles))
            }else{
                dispatch(setUserData(null, null, []))
            }
        })
    }
}

export const login = (username, password, rememberMe = false)=>{
    return (dispatch)=>{
        return AuthAPI.login(username, password, rememberMe).then(data=>{
            if(data && data.successCode === 0){
                dispatch(getAndSetUserData())
            }
            return data;
        })
    }
}

export const logout = ()=>(dispatch)=>{
    AuthAPI.logout().then(data=>{
        if(data && data.successCode === 0){
            dispatch(setUserData(null, null, []))
            dispatch(updateTasks({completedTasks:[], uncompletedTasks:[]}))
        }
    })
}

export const register = (username, password)=>(dispatch)=>{
    AuthAPI.register(username, password).then(data=>{
        if(data && data.successCode === 0){
            dispatch(login(username, password))
        }
    })
}

export const changeUsername = (newUsername)=>(dispatch)=>{
    return AuthAPI.changeUsername(newUsername).then(data=>{
        if(data && data.successCode === 0){
            dispatch(changeUsernameAC(newUsername))
        }
        return data;
    })
}

export const changePassword = (oldPassword, newPassword)=>(dispatch)=>{
    return AuthAPI.changePassword(oldPassword, newPassword).then(data=>{
        return data;    
    })
}

export default authReducer;