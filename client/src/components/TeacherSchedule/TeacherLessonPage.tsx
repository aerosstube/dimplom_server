import React, {useEffect, useState} from 'react';
import cl from './TeacherLessonPage.module.css';
import {useNavigate, useParams} from "react-router-dom";
import {lessonApi} from "../../services/LessonService";
import {useAppSelector} from "../../hooks";
import TextArea from "antd/es/input/TextArea";
import {Button, Upload, UploadProps} from "antd";
import {teacherAPI} from "../../services/TeacherService";
import {UpdateLessonInfo} from "../../models/ITeacher";
import {UploadOutlined} from "@ant-design/icons";
import {baseURL} from "../../services/config";


const LessonPage = () => {
    const navigate = useNavigate();
    const {accessToken} = useAppSelector(state => state.userReducer.tokens.tokens)
    const {schedule_id: id} = useParams();
    const {data: currentLesson} = lessonApi.useFetchCurrentLessonQuery(id);
    const [theme, setTheme] = useState<any>('');
    const [dz, setDz] = useState<any>('');
    const [updateLessonInfo] = teacherAPI.useUpdateLessonInfoMutation();
    useEffect(() => {
        if (currentLesson) {
            setTheme(currentLesson.lessonTheme);
            setDz(currentLesson.homework?.split('@%').join('\n'));
        }
    }, [currentLesson])
    const handleSend = () => {
        if (currentLesson) {
            const scheduleInfo: UpdateLessonInfo = {
                id: currentLesson.id,
                homework: dz?.split('\n').join('@%'),
                lessonTheme: theme
            }
            updateLessonInfo(scheduleInfo)
            navigate('/teacherSchedule')
        }
    }
    const props: UploadProps = {
        action: `${baseURL}/api/teacher/schedule/fileUpload?scheduleId=${currentLesson && currentLesson.id}`,
        headers: {'Authorization': `Bearer ${accessToken.toString()}`},
        onChange({file, fileList}) {
            if (file.status !== 'uploading') {
                console.log(file, fileList);
            }
        },
        defaultFileList: [
            {
                uid: '1',
                name: currentLesson ? currentLesson.file && '...' + currentLesson?.file?.split('/')[currentLesson.file.split('/').length - 1] : '',
                status: "success"
            }]
    };

    const UploadFile: React.FC = () => (
        <Upload {...props}>
            <Button icon={<UploadOutlined/>}>Upload</Button>
        </Upload>
    );

    return (
        <div className={cl.lessonPage}>
            <span style={{display: 'flex', justifyContent: 'space-between'}}>
                <p className={cl.lessonName}>{currentLesson && currentLesson.twoOurClassName} ({currentLesson && currentLesson.numberOfSchedule} урок) </p>
               <p className={cl.lessonName}
                  style={{marginRight: '90px'}}>Класс: {currentLesson && currentLesson.groupName}</p>
            </span>

            <div className={cl.lessonContainer}>
                <div className={cl.hometasks}>
                    <span style={{display: 'flex'}}>
                    <p className={cl.lessonBlocksText}>Тема урока</p>
                        </span>
                    <TextArea rows={5} className={cl.textArea} value={theme}
                              onChange={(e) => setTheme(e.target.value)}/>
                </div>
                <div className={cl.hometasks}>
                    <span style={{display: 'flex'}}>
                    <p className={cl.lessonBlocksText}>Домашнее задание:</p>
                        </span>
                    <TextArea rows={5} className={cl.textArea} value={dz} onChange={(e) => {
                        if (e.target.value.split('\n').length <= 5)
                            setDz(e.target.value)
                    }}/>
                </div>
                <div className={cl.markContain}>
                    <UploadFile/>
                    <Button className={cl.buttonLesson} onClick={handleSend}>Сохранить изменения</Button>
                </div>

            </div>

        </div>

    );
};

export default LessonPage;