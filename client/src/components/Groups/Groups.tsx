import React, {useEffect} from 'react';
import cl from './Groups.module.css'
import {useNavigate} from "react-router-dom";
import {Button} from "antd";
import {teacherAPI} from "../../services/TeacherService";


const Groups = () => {
    const navigate = useNavigate();
    const {data: groups, refetch} = teacherAPI.useFetchGroupsQuery('');
    const goToMarks = (name: string, groupID: number) => navigate('/teacherPlace', {
        state: {
            name: name,
            lesson: '',
            groupID: groupID,
            classID: 0
        }
    });
    useEffect(() => {
        refetch()
    }, [])

    return (
        <div className={cl.groupContain}>
            {
                //@ts-ignore
                groups && groups.groups.map((group) => <Button key={group.id} className={cl.groupBlock}
                                                               onClick={() => goToMarks(group.name, group.id)}>{group.name}</Button>)
            }

        </div>
    );
};

export default Groups;