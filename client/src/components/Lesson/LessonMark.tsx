import {FC} from 'react';
import cl from './Lesson.module.css';
import {LessonProps} from "./Lesson";
import {useNavigate} from "react-router-dom";
import {checkScheduleMark} from "../../utils/checkScheduleMark";
import {PaperClipOutlined} from "@ant-design/icons";
import {downloadFile} from "../../utils/downloadFile";
import {useAppSelector} from "../../hooks";


const LessonMark: FC<LessonProps> = ({schedule}) => {
    const navigate = useNavigate();
    const {accessToken} = useAppSelector(state => state.userReducer.tokens.tokens)
    const mark = schedule.mark ? schedule.mark.toString() : '-';
    const teacherName = schedule.teacher.split(/\s+/).map((w, i) => i ? w.substring(0, 1).toUpperCase() + '.' : w).join(' ');
    const lessonsName = schedule.twoOurClassName.split('').length > 10 ? schedule.twoOurClassName.substring(0, 10) + '.' : schedule.twoOurClassName;
    const handleClickPick = async (e: any) => {
        e.stopPropagation();
        await downloadFile(schedule.file, accessToken)
    }
    return (
        <div className={cl.lessonContain} onClick={() => navigate(`/scheduleAndMarks/${schedule.id}`, {
            state: {
                id: schedule.id,
                mark: schedule.mark
            }
        })}>
            <p className={cl.lessonNumber}>{schedule.numberOfSchedule || 0}</p>
            <div className={cl.lessonTextLeft}>
                <p className={cl.lessonName}>{lessonsName}</p>
                <p className={cl.teacherName}>{teacherName}</p>
            </div>
            <div className={cl.flexContain}>
                {schedule.file ? <PaperClipOutlined className={cl.icon} onClick={(e) => handleClickPick(e)}/> : <></>}
                <div className={checkScheduleMark(mark)}>
                    <p className={cl.markText}>{mark}</p>
                </div>
            </div>
        </div>
    );
};

export default LessonMark;