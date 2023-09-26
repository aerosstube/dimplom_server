import React from 'react';
import cl from "./Header.module.css";
import {NavLink} from "react-router-dom";
import {useAppSelector} from "../../hooks";

const HeaderTexts = () => {
    const {user} = useAppSelector(state => state.userReducer);
    const isLogged = useAppSelector(state => state.userReducer.isLogged);
    return (
        <>
            {
                isLogged ?
                    <>
                        {user && user.isTeacher ?
                            <div className={cl.headerContain}>
                                <NavLink to='/groups'
                                         className={({isActive}) => isActive ? cl.activeLink : cl.headerText}>Классы</NavLink>
                                <NavLink to='/teacherSchedule'
                                         className={({isActive}) => isActive ? cl.activeLink : cl.headerText}>Расписание</NavLink>
                            </div>
                            :
                            <div className={cl.headerContain}>
                                <NavLink to='/scheduleAndMarks'
                                         className={({isActive}) => isActive ? cl.activeLink : cl.headerText}>Учебная
                                    неделя</NavLink>
                                <NavLink to='/studentMarks'
                                         className={({isActive}) => isActive ? cl.activeLink : cl.headerText}>Успеваемость</NavLink>
                                <NavLink to='/schedule'
                                         className={({isActive}) => isActive ? cl.activeLink : cl.headerText}>Расписание</NavLink>
                                <NavLink to='/attendance'
                                         className={({isActive}) => isActive ? cl.activeLink : cl.headerText}>Посещаемость</NavLink>
                            </div>

                        }
                    </>
                    : <></>
            }
        </>
    );
};

export default HeaderTexts;