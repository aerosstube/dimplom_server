import { Router } from 'express';

import { AuthMiddleware } from '../../../middlewares/auth-middleware';
import { StudentController } from '../controllers/student.controller';

const studentRouter: Router = Router();

studentRouter
    .get('/getAllMarks', AuthMiddleware, StudentController.getAllMarks)
    .get('/getAllMisses', AuthMiddleware, StudentController.getAllMisses);

export { studentRouter };
