import React from 'react';
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../../../hooks";


const CheckAuth = ({children}: any) => {

    const isLogged = useAppSelector(state => state.userReducer.isLogged)
    if (!isLogged) {
        return <Navigate to='/auth'/>

    }
    return children

};

export default CheckAuth;