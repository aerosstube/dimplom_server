import React from 'react';
import {useAppSelector} from "../../../hooks";
import {Navigate} from "react-router-dom";

const CheckAdminAuth = ({children}: any) => {
    const {user} = useAppSelector(state => state.userReducer)

    if (user && user.role != 'ADMIN') {
        return <Navigate to='/auth'/>

    }
    return children

};


export default CheckAdminAuth;