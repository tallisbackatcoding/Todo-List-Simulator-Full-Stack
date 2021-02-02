import { AdminAPI } from "../api/api";

const GET_USERS = 'GET_USERS';

let initialState = {
    users: []
}

const appReducer = (state = initialState, action) =>{
    if (!action){
        return state
    }
    switch(action.type){
        
        case GET_USERS: {
            return {...state, users: [...action.users]}
        }
        default:
            return state
    }
}

export const getUsersAC = (users)=>({type:GET_USERS, users})

export const getUsersThunk = ()=>(dispatch)=>{
    return AdminAPI.allUsers().then(data=>{
        if(data.successCode === 0){
            dispatch(getUsersAC(data.users));
        }
    })
}



export default appReducer;