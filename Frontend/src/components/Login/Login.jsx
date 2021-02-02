import React, {useState} from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {login} from './../../redux/authReducer';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css'


const Login = (props) => {
    const [loginError, setLoginError] = useState("");


    if (props.isAuth){
        return <Redirect to='/'/>
    }


    return (
        <div className={styles.login}>
            <div className={styles.loginBox}>
            <h2>Login</h2>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.username) {
                            errors.username = 'Required';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={(values,{ setSubmitting }) => {
                        setLoginError("");
                        setSubmitting(true);
                        props.login(values.username, values.password).then(data=>{
                            if(data.successCode === 1){
                                setLoginError("Bad credentials");
                            }
                            setSubmitting(false);
                        })
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
                                type="input"
                                name="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder = "Username"
                                value={values.username}/>
                                {errors.username && touched.username && errors.username}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="password" 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder = "Password"
                                    value={values.password}
                                />
                                {errors.password && touched.password && errors.password}
                                {loginError && <div>{loginError}</div>}
                            </div>
                            <div>
                                <button type="submit" disabled={isSubmitting}>Login</button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>)
};

const mapStateToProps = state=>{
    return {
        isAuth: state.auth.isAuth
    }
}

export default connect(mapStateToProps, {login})(Login);