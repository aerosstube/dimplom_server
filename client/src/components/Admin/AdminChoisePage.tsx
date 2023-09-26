import React from 'react';
import cl from '../Groups/Groups.module.css'
import {useNavigate} from "react-router-dom";

const AdminChoisePage = () => {
    const navigate = useNavigate();
    return (
        <div className={cl.groupContain}>
            <div className={cl.groupBlock} onClick={() => navigate('/adminUsers')}>Пользователи</div>
            <div className={cl.groupBlock} onClick={() => navigate('/adminSchedules')}>Расписание</div>
            <div className={cl.groupBlock} onClick={() => navigate('/adminAudiences')}>Кабинеты</div>
            <div className={cl.groupBlock} onClick={() => navigate('/adminGroups')}>Классы</div>
            <div className={cl.groupBlock} onClick={() => navigate('/adminLessons')}>Предметы</div>
        </div>
    );
};

export default AdminChoisePage;