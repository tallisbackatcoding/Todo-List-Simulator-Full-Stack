import thunkMiddleware from 'redux-thunk';
import authReducer from './authReducer';
import taskReducer from './taskReducer';
import adminReducer from './adminReducer';
import thunk from "redux-thunk" 
import appReducer from './appReducer';

const {createStore, combineReducers, applyMiddleware } = require("redux");

let reducers = combineReducers({
    auth: authReducer,
    list: taskReducer,
    app: appReducer,
    admin: adminReducer
})

let store = createStore(reducers, applyMiddleware(thunk));

export default store;