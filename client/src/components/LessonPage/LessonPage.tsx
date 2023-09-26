import React from 'react';
import cl from './LessonPage.module.css';
import {useLocation, useParams} from "react-router-dom";
import {lessonApi} from "../../services/LessonService";
import {checkLessonMark} from "../../utils/checkLessonMark";
import {Button} from "antd";
import {useAppSelector} from "../../hooks";
import {downloadFile} from "../../utils/downloadFile";

const LessonPage = () => {
    const info = useLocation();
    const {accessToken} = useAppSelector(state => state.userReducer.tokens.tokens)
    const {schedule_id: id} = useParams();
    const {data: currentLesson} = lessonApi.useFetchCurrentLessonQuery(id);
    const path = currentLesson ? currentLesson.file : '';
    const mark = info.state.mark ? info.state.mark.toString() : '-';
    const FileUpload: React.FC = () => (
        <>
            <p className={cl.uploadText}>Загрузить файл:</p>
            <p className={cl.uploadLittleText}>{path?.split('/')[path?.split('/').length - 1].slice(0, 25) + '...'}</p>
            <Button className={cl.button} disabled={(!path)}
                    onClick={() => downloadFile(path, accessToken)}>Загрузить</Button>
        </>
    );

    return (
        <div className={cl.lessonPage}>
            <span style={{display: 'flex', justifyContent: 'space-between'}}>
                <p className={cl.lessonName}>{currentLesson && currentLesson.twoOurClassName} ({currentLesson && currentLesson.numberOfSchedule} урок) </p>
               <p className={cl.lessonName}
                  style={{marginRight: '90px'}}>Преподаватель: {currentLesson && currentLesson.teacher.split(/\s+/).map((w, i) => i ? w.substring(0, 1).toUpperCase() + '.' : w).join(' ')}</p>
            </span>

            <div className={cl.lessonContainer}>
                <div className={cl.hometasks}>
                    <span style={{display: 'flex'}}>
                    <p className={cl.lessonBlocksText}>Тема урока</p>
                        </span>
                    <p className={cl.lessonTheme}>{currentLesson && currentLesson.lessonTheme}</p>
                </div>
                <div className={cl.hometasks}>
                    <p className={cl.lessonBlocksText}>Домашнее задание</p>
                    <ul>
                        {currentLesson && currentLesson?.homework?.split('@%').map((dz) =>
                            <li className={cl.li}>{dz}</li>
                        )}
                    </ul>
                </div>
                <div className={cl.markContain}>
                    <div className={cl.markBlock}>
                        <p className={cl.lessonTheme}>Оценка:</p>
                        <div className={checkLessonMark(mark)}>
                            {mark}
                        </div>
                    </div>
                    <FileUpload/>
                </div>
            </div>

        </div>

    );
};

export default LessonPage;