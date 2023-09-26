import { NextFunction, Response } from 'express';
import { ApiError } from '../../../errors/api.error';
import { RequestWithUser } from '../../../middlewares/auth-middleware';
import { ScheduleBusinessService } from '../../../services/schedule-services/schedule.business.service';


export class ScheduleController {
    static async getScheduleWeek(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { startOfWeek } = req.query;
            if (typeof startOfWeek !== 'string')
                return next(ApiError.BadRequest('Неверный запрос!'));

            const day = await ScheduleBusinessService.getScheduleWeek(req.user, new Date(startOfWeek));
            res.json(day.scheduleDays);
        } catch (err) {
            next(err);
        }
    }

    static async getScheduleWeekWithMarks(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { startOfWeek } = req.query;
            if (typeof startOfWeek !== 'string')
                return next(ApiError.BadRequest('Неверный запрос!'));

            const day = await ScheduleBusinessService.getScheduleWeekMarks(req.user, new Date(startOfWeek));
            res.json(day.scheduleDays);
        } catch (err) {
            next(err);
        }
    }

    static async getScheduleById(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { params: { id } } = req;

            res.status(200).json(await ScheduleBusinessService.getScheduleById(parseInt(id)));
        } catch (err) {
            next(err);
        }
    }

    static async downloadFile(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { query: { filePath } } = req;

            if (typeof filePath === 'string') {
                res.download(filePath);
            } else {
                res.status(400).json('Неверный путь!');
            }
        } catch (err) {
            next(err);
        }
    }


    static async getTeacherShedule(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const { startOfWeek } = req.query;
            if (typeof startOfWeek !== 'string')
                return next(ApiError.BadRequest('Неверный запрос!'));

            const day = await ScheduleBusinessService.getTeacherSchedule(req.user, new Date(startOfWeek));
            res.json(day.scheduleDays);
        } catch (err) {
            next(err);
        }
    }
}