import Dropdown from 'react-bootstrap/Dropdown'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styles from './Header.module.css'
import { AiOutlineUser } from "react-icons/ai";
import { NavLink , Link} from 'react-router-dom';
import {getAndSetUserData, logout} from './../../redux/authReducer'
import styled from 'styled-components'

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
    &:hover{
        color: white;
    }
`;


const HeaderContainer = (props)=>{
    return (
        <Header {...props}/> 
    )
}

const Header = (props)=>{
    return (
        <div className={styles.Header}>
            <div className={styles.textLogo}>
                <StyledLink to="/" ><div>Todo list Simulator</div></StyledLink>
            </div>
            <div className={styles.dropdownWrapper}>
                <Dropdown className={styles.dropdown}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className = {styles.Button}>
                        <AiOutlineUser size={20}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className = {styles.Menu}>
                        <div className = {styles.dropdownItem}>{props.isAuth && <NavLink to="/profile">{props.username}</NavLink>}</div>
                        <div className = {styles.dropdownItem}>{props.isAuth && (props.roles.includes('ROLE_MOD') || props.roles.includes('ROLE_ADMIN')) && <NavLink to="/admin">{"Admin Page"}</NavLink>}</div>
                        <div className = {styles.dropdownItem + ' ' + styles.divButton} onClick = {props.logout}>{props.isAuth && "Logout"}</div>
                        <div className = {styles.dropdownItem}>{!props.isAuth && <NavLink to="/login">Login</NavLink>}</div>
                        <div className = {styles.dropdownItem}>{!props.isAuth && <NavLink to="/register">Sign up</NavLink>}</div>
                    </Dropdown.Menu>
                    </Dropdown>
                </div>
            <div className={styles.UserBox}>
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
        isAuth: state.auth.isAuth,
        username: state.auth.username,
        roles: state.auth.roles
    }
}

export default connect(mapStateToProps, {getAndSetUserData, logout})(HeaderContainer);