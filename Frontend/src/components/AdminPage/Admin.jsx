import React, {useEffect} from "react";
import { connect } from "react-redux";
import { getUsersThunk } from "../../redux/adminReducer";
import styles from './Admin.module.css';

const AdminPage = (props)=>{
    
    const userElements = props.users.map(user => {
        return (
            <tr>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{new Date(user.lastAccessDate).toString().slice(4, 24)}</td>
                <td>{new Date(user.registrationDate).toString().slice(4, 24)}</td>
                <td>{user.roles[0].name}</td>
            </tr>
        )
    })

    useEffect(() => {
        if(props.users.length === 0){
            props.getUsersThunk();
        }
    })
    
    if(!props.roles.includes('ROLE_ADMIN') && !props.roles.includes('ROLE_MOD')){
        return <h1 style={{textAlign:"center"}}>You are not allowed to visit this page</h1>
    }

    return <div className={styles.Admin}>
        <h1>Admin Page</h1>
        <table className={styles.userTable}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Last Access</th>
                    <th>Member Since</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {userElements}
            </tbody>
        </table>
    </div>
}

const matStateToProps = (state)=>{
    return {
        users: state.admin.users,
        roles: state.auth.roles
    }
}

export default connect(matStateToProps, {getUsersThunk})(AdminPage);