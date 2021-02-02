import React, {useState} from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {register} from '../../redux/authReducer';
import { Redirect } from 'react-router-dom';
import styles from './Registration.module.css'

const Registration = (props) => {
    const [loginError, setLoginError] = useState("");

    if (props.isAuth){
        return <Redirect to='/'/>
    }
    const validateConfirmPassword = (pass, value) => {

        let error = "";
        if (pass && value) {
          if (pass !== value) {
            error = "Password not matched";
          }
        }
        return error;
      };
    return (
        <div className={styles.registration}>
            <div className={styles.registrationBox}>
                <h2>Signup</h2>
                <Formik
                    initialValues={{ username: '', password: '' , passwordConfirm: ''}}
                    validate={values => {
                        const errors = {};
                        if (!values.username) {
                            errors.username = 'Required';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        }
                        if(values.passwordConfirm !== values.password){
                            errors.passwordConfirm = "Passwords don't match"
                        }
                        return errors;
                    }}
                    onSubmit={(values,{ setSubmitting }) => {
                        setLoginError("");
                        setSubmitting(true);
                        props.register(values.username, values.password).then(data=>{
                            if(data.successCode === 1){
                                setLoginError("Something went wrong");
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
                                <div>
                                    {errors.username && touched.username && errors.username}
                                </div>
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
                                <div>
                                    {errors.password && touched.password && errors.password}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="passwordConfirm" 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder = "Confirm Password"
                                    value={values.passwordConfirm}
                                />
                                <div>
                                    {errors.passwordConfirm && touched.passwordConfirm && errors.passwordConfirm}
                                </div>
                            </div>
                            {loginError && <div>{loginError}</div>}
                            <div>
                                <button type="submit" disabled={isSubmitting}>Sign Up</button>
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

export default connect(mapStateToProps, {register})(Registration);