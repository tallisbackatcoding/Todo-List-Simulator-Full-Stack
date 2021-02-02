import React, {useEffect} from 'react'
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { startApp } from '../../redux/appReducer';
import Preloader from '../common/Preloader/Preloader';
import Content from '../Content/Content';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import Registration from '../Registration/Registration';


import ReactNotification from 'react-notifications-component'
import AdminPage from '../AdminPage/Admin';


const Wrapper = (props)=>{

    useEffect(() => {
        props.startApp();
    })

    if (!props.isAppReady) {
        return (<Preloader/>)
    }
    
    return (
        <div>
            <ReactNotification/>
            <Header/>
            <Route path="/login">
                <Login/>
            </Route>
            <Route path="/register">
                <Registration/>
            </Route>
            <Route exact path="/">
                <Content/>
            </Route>
            <Route path="/profile">
                <Profile/>
            </Route>
            <Route path="/admin">
                <AdminPage/>
            </Route>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
        isAppReady: state.app.isAppReady
    }
}


export default connect(mapStateToProps, {startApp})(Wrapper);