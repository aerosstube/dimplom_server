import React from 'react';
import cl from "./Groups.module.css";
import {Button} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

const LessonsChoise = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const goToMarks = (lessonName: string, classID: number) => navigate('/teacherPlace', {
        state: {
            name: location.state.name,
            nameOfLesson: lessonName,
            groupID: location.state.groupID,
            classID: classID
        }
    });

    return (
        <div className={cl.groupContain}>

            {
                // @ts-ignore
                data ? data.classes && data.classes.map((lesson) => <Button key={lesson.id} className={cl.groupBlock}
                                                                            onClick={() => goToMarks(lesson.name, lesson.id)}>{lesson.name}</Button>) :
                    <div></div>
            }


        </div>
    );
};

export default LessonsChoise;