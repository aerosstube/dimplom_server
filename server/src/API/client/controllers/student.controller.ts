import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../../../middlewares/auth-middleware';
import { StudentBusinessService } from '../../../services/student-services/student.business.service';


export class StudentController {
    static async getAllMarks(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { user } = req;
            res.json(await StudentBusinessService.getAllMarks(user.userId));
        } catch (err) {
            next(err);
        }
    }

    static async getAllMisses(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { user } = req;
            res.json(await StudentBusinessService.getAllMisses(user.userId));
        } catch (err) {
            next(err);
        }
    }
}