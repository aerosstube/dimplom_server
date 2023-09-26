import React, {FC, useEffect, useState} from 'react';
import cl from './LearningWeek.module.css';
import {getMonday} from "../../utils";
import {lessonApi} from "../../services/LessonService";
import LearningDayMark from "../learningDay/LearnigDayMark";
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons";

const LearningWeekMark: FC = () => {
    const [mainMarkDate, setMainMarkDate] = useState(getMonday(new Date()));
    const {data: days, refetch, error} = lessonApi.useFetchMarksQuery(mainMarkDate.toISOString());
    const renderDate = new Date(mainMarkDate);
    const arr = [{}, {}, {}, {}, {}, {}]
    renderDate.setDate(mainMarkDate.getDate() + 1)
    const AddWeek = () => {
        const date = mainMarkDate;
        date.setDate(date.getDate() + 7)
        setMainMarkDate(getMonday(date));
        refetch();
    }
    const RemoveWeek = () => {
        const date = mainMarkDate;
        date.setDate(date.getDate() - 7)
        setMainMarkDate(getMonday(date))
        refetch();
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
                    days?.map((day: any, index: number) => <LearningDayMark key={index}
                                                                            nameOfDay={index}
                                                                            schedules={error ? undefined : day.schedules}/>)
                    :
                    arr.map((dr, index) => <LearningDayMark key={index}
                                                            nameOfDay={index}
                                                            schedules={undefined}/>)
                }
            </div>
        </>
    );
};
export default LearningWeekMark;