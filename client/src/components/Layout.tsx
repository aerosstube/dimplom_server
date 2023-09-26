import React, {useEffect, useState} from 'react';
import Header from "./Header/Header";
import {Outlet} from "react-router-dom";
import {useAppSelector} from "../hooks";

const Layout = () => {
    const {user} = useAppSelector(state => state.userReducer);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (user) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false)
            })
        }
    }, [user])
    return (
        <>
            <Header/>
            {!isLoading && <Outlet/>}

        </>
    );
};

export default Layout;