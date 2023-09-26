import { Router } from 'express';
import { AuthMiddleware } from '../../../middlewares/auth-middleware';
import { LessonController } from '../controllers/lesson.controller';


const lessonRouter = Router();

lessonRouter
    .delete('/delete', AuthMiddleware, LessonController.delete)
    .post('/create_or_update', AuthMiddleware, LessonController.createOrUpdate)
    .get('/get_all', AuthMiddleware, LessonController.getAll);

export { lessonRouter };