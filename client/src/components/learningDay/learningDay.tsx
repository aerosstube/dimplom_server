import {FC} from 'react';
import cl from './LearningDay.module.css';
import {Schedule} from "../../models/ISchedule";
import Lesson from "../Lesson/Lesson";
import {weekdays} from "../TeacherSchedule/TeacherLearningDay";
import {getformattedSecAndMin} from "../Admin/CreateScheduleAdminPage/CreateAdminSchedule";

export interface LearningDayProps {
    nameOfDay: number;
    schedules: Schedule[] | undefined;

}

const LearningDay: FC<LearningDayProps> = ({nameOfDay, schedules}) => {
    const month = schedules ? getformattedSecAndMin((new Date(schedules[0]?.dateOfClass).getMonth() + 1).toString()) : 0
    const day = schedules ? getformattedSecAndMin((new Date(schedules[0]?.dateOfClass).getDate()).toString()) : 0
    return (
        <div className={cl.dayPlace}>
            <p className={cl.dayName}>{(month !== 0 && day !== 0) && (month !== 'NaN' && day !== 'NaN') ? weekdays[nameOfDay] + '(' + day + '.' + month + ')' : weekdays[nameOfDay]}</p>
            <div className={cl.dayContain}>
                {schedules ?
                    schedules.length !== 0 ? schedules.map((lesson) => <Lesson key={lesson.id} schedule={lesson}/>) :
                        <h1 className={cl.dayTextNonLessons}> Нет занятий</h1>
                    : <h1 className={cl.dayTextNonLessons}> Нет занятий</h1>
                }
            </div>
        </div>

    );
};

export default LearningDay;