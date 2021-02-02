import { Formik } from 'formik';
import React, {useState} from 'react';
import { connect } from 'react-redux';
import styles from './Profile.module.css';
import {changePassword, changeUsername} from './../../redux/authReducer'
import 'animate.css'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import { Redirect } from 'react-router-dom';

const passwordChangeSuccessNotification=()=>{
    store.addNotification({
        title: "Password changed successfully",
        message: "Don't forget your password!",
        type: "success",
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

const passwordsNotMatchDangerNotification=()=>{
    store.addNotification({
        title: "Old password doesn't match!",
        message: "Try again",
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

const usernameChangeSuccessNotification=()=>{
    store.addNotification({
        title: "Username changed successfully",
        message: "Thanks for using our service!",
        type: "success",
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

const usernameExistsDangerNotification=()=>{
    store.addNotification({
        title: "Entered username already exists!",
        message: "Try again",
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

const Profile = (props)=>{
    let textInput = React.createRef();
    let [usernameEditMode, setUsernameEditMode] = useState(false); 
    let [passwordEditMode, setPasswordEditMode] = useState(false); 
    
    const handleUsernameChange=(e)=>{
        props.changeUsername(e.current.value).then(data=>{
            if(data.successCode === 0){
                setUsernameEditMode(false);
                usernameChangeSuccessNotification();
            }else{
                usernameExistsDangerNotification();
            }
        })
    }
    if(!props.isAuth){
        return <Redirect to="/login"/>
    }
    return (<div className={styles.profile}>
        <div className={styles.avatar}>
            <img src='https://i.pinimg.com/236x/05/6b/30/056b30d5a91530eac4d2fe5f5a6e4d04.jpg'/>
        </div>
        <div className={styles.username}>
            {"Username: " + props.username}
        </div>
        <div className={styles.changeProfile} onClick={()=>setUsernameEditMode(true)}>
            change username
        </div>      
        <div className={styles.changeProfile} onClick={()=>setPasswordEditMode(true)}>
            change password
        </div>
        {usernameEditMode && 
            <div>
                <div>New Username:</div>
                <input ref={textInput} type="text" autoFocus={true}/>
                <div>
                    <button onClick = {()=>handleUsernameChange(textInput)}>Save</button>
                    <button onClick={()=>{setUsernameEditMode(false)}}>Cancel</button>
                </div>
            </div>
        }
        {passwordEditMode && 
            <Formik
                    initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.oldPassword) {
                            errors.oldPassword = 'Required';
                        }
                        if (!values.newPassword) {
                            errors.newPassword = 'Required';
                        }
                        if(values.newPassword !== values.confirmNewPassword){
                            errors.confirmNewPassword = "Passwords don't match";
                        }
                        return errors;
                    }}
                    onSubmit={(values,{ setSubmitting }) => {
                        
                        
                        setSubmitting(true);
                        props.changePassword(values.oldPassword, values.newPassword).then(data => {
                            if(data.successCode === 0){
                                passwordChangeSuccessNotification();
                                setPasswordEditMode(false);
                            }else{
                                passwordsNotMatchDangerNotification();
                            }
                        })
                        setSubmitting(false);
                    }}>
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,

                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                type="password"
                                name="oldPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder = "Old Password"
                                value={values.username}/>
                                
                            </div>
                                {errors.oldPassword && touched.oldPassword && errors.oldPassword}
                            <div>
                                <input
                                    type="password"
                                    name="newPassword" 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder = "New Password"
                                    value={values.password}
                                />
                            </div>
                            {errors.newPassword && touched.newPassword && errors.newPassword}
                            <div>
                                <input
                                    type="password"
                                    name="confirmNewPassword" 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder = "Confirm New Password"
                                    value={values.password}
                                />
                            </div>
                                {errors.confirmNewPassword && touched.confirmNewPassword && errors.confirmNewPassword}
                            <div>
                                <button type="submit" disabled={isSubmitting}>Save</button>
                                <button disabled={isSubmitting} onClick={()=>{setPasswordEditMode(false)}}>Cancel</button>
                            </div>
                        </form>
                    )}
                </Formik>
        }
    </div>)
}

const matStateToProps = (state) =>{
    return {
        username: state.auth.username,
        isAuth: state.auth.isAuth
    }
}

export default connect(matStateToProps, {changePassword, changeUsername})(Profile);