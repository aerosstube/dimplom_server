import React, {FC, useEffect, useState} from 'react';
import LearningDay from '../learningDay/learningDay';
import cl from './LearningWeek.module.css';
import {getMonday} from "../../utils";
import {lessonApi} from "../../services/LessonService";
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons";


const LearningWeek: FC = () => {
    const [mainDate, setMainDate] = useState(getMonday(new Date()));
    const {data: days, error, refetch} = lessonApi.useFetchLessonsQuery(mainDate.toISOString());
    const renderDate = new Date(mainDate);
    const arr = [{}, {}, {}, {}, {}, {}]
    renderDate.setDate(mainDate.getDate() + 1)
    const AddWeek = () => {
        const date = mainDate;
        date.setDate(date.getDate() + 7)
        setMainDate(getMonday(date))
    }
    const RemoveWeek = () => {
        const date = mainDate;
        date.setDate(date.getDate() - 7)
        setMainDate(getMonday(date))
    }
    useEffect(() => {
        refetch()
    }, [])
    return (
        <>
            <div className={cl.pageContain}>
                <LeftCircleOutlined className={cl.pageIcon} onClick={RemoveWeek}/>
                <p className={cl.pageText}>{renderDate.toISOString().split('T')[0].split('-')[2] + '.' + renderDate.toISOString().split('T')[0].split('-')[1] + '.' + renderDate.toISOString().split('T')[0].split('-')[0]}</p>
                <RightCircleOutlined className={cl.pageIcon} onClick={AddWeek}/>
            </div>
            <div className={cl.learningWeek}>
                {!error ?
                    days?.map((day: any, index: number) => <LearningDay key={index}
                                                                        nameOfDay={index}
                                                                        schedules={error ? undefined : day.schedules}/>)
                    :
                    arr.map((dr, index) => <LearningDay key={index}
                                                        nameOfDay={index}
                                                        schedules={undefined}/>)
                }
            </div>
        </>
    );
};
export default LearningWeek;