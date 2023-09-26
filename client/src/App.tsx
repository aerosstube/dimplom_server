import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import AuthForm from "./components/Regestration/AuthForm/AuthForm";
import LearningWeek from "./components/LearningWeek/LearningWeek";
import CheckAuth from "./components/Regestration/AuthForm/CheckAuth";
import LearningWeekMark from "./components/LearningWeek/LearningWeekMark";
import {useRefreshUser} from "./hooks";
import Layout from "./components/Layout";
import TeacherPlaceForMarks from "./components/TeacherPlaceForMarks/TeacherPlaceForMarks";
import Groups from "./components/Groups/Groups";
import LessonsChoise from "./components/Groups/LessonsChoise";
import StudentPlaceForMarks from "./components/StudentPlaceForMarks/StudentPlaceForMarks";
import LessonPage from "./components/LessonPage/LessonPage";
import CreateAdminSchedule from "./components/Admin/CreateScheduleAdminPage/CreateAdminSchedule";
import CheckAdminAuth from "./components/Regestration/AuthForm/CheckAdminAuth";
import {ConfigProvider} from "antd";
import ru_RU from 'antd/lib/locale/ru_RU';
import GetMisses from "./components/GetMisses/GetMisses";
import TeacherSchedule from "./components/TeacherSchedule/TeacherSchedule";
import TeacherLessonPage from "./components/TeacherSchedule/TeacherLessonPage";
import AdminChoisePage from "./components/Admin/AdminChoisePage";
import AudiencePage from "./components/Admin/CreateAudienceAdminPage/AudiencePage";
import CreateAudiencePage from "./components/Admin/CreateAudienceAdminPage/CreateAudiencePage";
import AdminGroups from "./components/Admin/CreateGroupsAdmin/AdminGroups";
import CreateAdminGroup from "./components/Admin/CreateGroupsAdmin/CreateAdminGroup";
import AdminLesson from "./components/Admin/CreateLessonsAdmin/AdminLesson";
import CreateAdminLesson from "./components/Admin/CreateLessonsAdmin/CreateAdminLesson";
import AdminUser from "./components/Admin/CreateUserAdmin/AdminUser";
import CreateAdminUser from "./components/Admin/CreateUserAdmin/CreateAdminUser";

export function App() {

    const appLoading = useRefreshUser();


    return (
        <ConfigProvider locale={ru_RU}>
            <div className="App">
                {
                    (appLoading)
                        ? <h1>Loading</h1>
                        :
                        <>
                            <Routes>
                                <Route path='/' element={<Layout/>}> {/*Корневая страница*/}
                                    <Route path='/lessons' element={<LessonsChoise/>}/>
                                    <Route path='/teacherPlace'
                                           element={<CheckAuth><TeacherPlaceForMarks/></CheckAuth>}/>
                                    <Route path='/studentMarks'
                                           element={<CheckAuth><StudentPlaceForMarks/></CheckAuth>}/>
                                    <Route path='/auth' element={<AuthForm/>}/> {/*Форма аутентифакации*/}
                                    <Route path='/scheduleAndMarks'
                                           element={<CheckAuth><LearningWeekMark/></CheckAuth>}/> {/*Успеваемость*/}
                                    <Route path='/schedule'
                                           element={<CheckAuth><LearningWeek/></CheckAuth>}/> {/*Расписание*/}
                                    <Route path='/groups' element={<CheckAuth><Groups/></CheckAuth>}/>
                                    <Route path='/attendance' element={<CheckAuth><GetMisses/></CheckAuth>}/>
                                    <Route path='/teacherSchedule' element={<CheckAuth><TeacherSchedule/></CheckAuth>}/>
                                    <Route path='/teacherSchedule/:schedule_id'
                                           element={<CheckAuth><TeacherLessonPage/></CheckAuth>}/>
                                    <Route path='/scheduleAndMarks/:schedule_id'
                                           element={<CheckAuth><LessonPage/></CheckAuth>}/>
                                    <Route path='/adminSchedules'
                                           element={<CheckAdminAuth><CreateAdminSchedule/></CheckAdminAuth>}/>
                                    <Route path='/attendance' element={<CheckAdminAuth><GetMisses/></CheckAdminAuth>}/>
                                    <Route path='/adminChoisePage'
                                           element={<CheckAdminAuth><AdminChoisePage/></CheckAdminAuth>}/>
                                    <Route path='/adminAudiences'
                                           element={<CheckAdminAuth><AudiencePage/></CheckAdminAuth>}/>
                                    <Route path='/adminAudiences/edit/:audience_id'
                                           element={<CheckAdminAuth><CreateAudiencePage/></CheckAdminAuth>}/>
                                    <Route path='/adminGroups'
                                           element={<CheckAdminAuth><AdminGroups/></CheckAdminAuth>}/>
                                    <Route path='/adminGroups/edit/:group_id'
                                           element={<CheckAdminAuth><CreateAdminGroup/></CheckAdminAuth>}/>
                                    <Route path='/adminLessons'
                                           element={<CheckAdminAuth><AdminLesson/></CheckAdminAuth>}/>
                                    <Route path='/adminLessons/edit/:lesson_id'
                                           element={<CheckAdminAuth><CreateAdminLesson/></CheckAdminAuth>}/>
                                    <Route path='/adminUsers'
                                           element={<CheckAdminAuth><AdminUser/></CheckAdminAuth>}/>
                                    <Route path='/adminUsers/edit/:user_id'
                                           element={<CheckAdminAuth><CreateAdminUser/></CheckAdminAuth>}/>
                                    <Route path='/studentMark'
                                           element={<CheckAuth><StudentPlaceForMarks/></CheckAuth>}/>


                                </Route>
                            </Routes>
                        </>
                }

            </div>
        </ConfigProvider>
    );
}

export default App;
