import { Router } from 'express';
import { AuthMiddleware } from '../../../middlewares/auth-middleware';
import { TeacherController } from '../controllers/teacher.controller';
import { ScheduleController } from '../controllers/schedule.controller';


const teacherRouter: Router = Router();

teacherRouter
    .get('/getStudentsMarks', AuthMiddleware, TeacherController.getGroupMarks)
    .get('/getAllowedGroups', AuthMiddleware, TeacherController.getAllowedGroups)
    .get('/getAllowedClasses', AuthMiddleware, TeacherController.getAllowedClasses)
    .get('/schedule/get_teacher_week', AuthMiddleware, ScheduleController.getTeacherShedule)
    .post('/updateStudentMark', AuthMiddleware, TeacherController.updateStudentMark)
    .post('/schedule/updateSchedule', AuthMiddleware, TeacherController.updateSchedule)
    .post('/schedule/fileUpload', AuthMiddleware, TeacherController.uploadFile);

export { teacherRouter };