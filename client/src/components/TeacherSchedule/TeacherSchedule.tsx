import React, {useState} from 'react';
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons";
import {getMonday} from "../../utils";
import {teacherAPI} from "../../services/TeacherService";
import TeacherLearningDay from "./TeacherLearningDay";
import classes from '../LearningWeek/LearningWeek.module.css'

const TeacherSchedule = () => {
    const [mainTeacherDate, setMainTeacherDate] = useState(getMonday(new Date()));
    const {data: days, refetch, error} = teacherAPI.useGetTeacherScheduleQuery(mainTeacherDate.toISOString());
    const renderDate = new Date(mainTeacherDate);
    const arr = [{}, {}, {}, {}, {}, {}]
    renderDate.setDate(mainTeacherDate.getDate() + 1)
    const AddWeek = () => {
        const date = mainTeacherDate;
        date.setDate(date.getDate() + 7)
        setMainTeacherDate(getMonday(date))
        refetch()
    }
    const RemoveWeek = () => {
        const date = mainTeacherDate;
        date.setDate(date.getDate() - 7)
        setMainTeacherDate(getMonday(date));
        refetch()
    }
    return (
        <>
            <div className={classes.pageContain}>
                <LeftCircleOutlined className={classes.pageIcon} onClick={RemoveWeek}/>
                <p className={classes.pageText}>{renderDate.toISOString().split('T')[0]}</p>
                <RightCircleOutlined className={classes.pageIcon} onClick={AddWeek}/>
            </div>


            <div className={classes.learningWeek}>
                {!error ?
                    days?.map((day: any, index: number) => <TeacherLearningDay key={index}
                                                                               nameOfDay={index}
                                                                               schedules={error ? undefined : day.schedules}/>)
                    :
                    arr.map((dr, index) => <TeacherLearningDay key={index}
                                                               nameOfDay={index}
                                                               schedules={undefined}/>)
                }
            </div>
        </>
    );
};

export default TeacherSchedule;