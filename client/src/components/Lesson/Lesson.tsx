import {FC} from 'react';
import cl from './Lesson.module.css';
import {Schedule} from "../../models/ISchedule";
import {useNavigate} from "react-router-dom";

export interface LessonProps {
    schedule: Schedule;
}

const Lesson: FC<LessonProps> = ({schedule}) => {
    const navigate = useNavigate()
    const teacherName = schedule.teacher.split(/\s+/).map((w, i) => i ? w.substring(0, 1).toUpperCase() + '.' : w).join(' ');
    const lessonsName = schedule.twoOurClassName.split('').length > 15 ? schedule.twoOurClassName.substring(0, 15) + '.' : schedule.twoOurClassName;
    const hours = (new Date(schedule.startTime).getHours().toString().length === 1) ? ('0' + new Date(schedule.startTime).getHours().toString()) : new Date(schedule.startTime).getHours().toString();
    const minutes = (new Date(schedule.startTime).getMinutes().toString().length === 1) ? '00' : new Date(schedule.startTime).getMinutes().toString();
    return (
        <div className={cl.lessonContain} onClick={() => navigate('')}>
            <div className={cl.lessonTextLeft}>
                <p className={cl.lessonName}>{lessonsName}</p>
                <p className={cl.teacherName}>{teacherName}</p>
            </div>
            <div className={cl.lessonTextRight}>
                <p className={cl.timeOfLesson}>{hours}:{minutes}</p>
                <p className={cl.numberOfCab}>к. {schedule.audience}</p>
            </div>
        </div>
    );
};

export default Lesson;