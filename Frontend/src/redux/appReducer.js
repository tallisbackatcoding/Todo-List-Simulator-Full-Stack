import {getAndSetUserData} from "./authReducer";

const SET_APP_READY = 'SET_APP_READY'

let initialState = {
    isAppReady: false
}

const appReducer = (state = initialState, action) =>{
    if (!action){
        return state
    }

    switch(action.type){
        case SET_APP_READY: {
            return {...state, isAppReady: true}
        }
        default:
            return state
    }
}

export const setAppReady = ()=>({type:SET_APP_READY})

export const startApp = ()=>(dispatch)=>{
    let promise1 = dispatch(getAndSetUserData())
    Promise.all([promise1]).then(()=>{
        dispatch(setAppReady())
    })
}



export default appReducer;