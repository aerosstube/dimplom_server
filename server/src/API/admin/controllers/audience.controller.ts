import { RequestWithUser } from '../../../middlewares/auth-middleware';
import { NextFunction, Response } from 'express';
import { SequelizeConnect } from '../../../services/database-connect';
import { Transaction } from 'sequelize';
import { AudienceBusinessService } from '../../../services/audience-service/audience.business.service';


export class AudienceController {
    static async createOrUpdate(req: RequestWithUser, res: Response, next: NextFunction) {
        const transaction: Transaction = await SequelizeConnect.transaction();
        try {
            const { body: { audienceOptions } } = req;
            await AudienceBusinessService.createOrUpdate(audienceOptions, transaction);

            res.json('Кабинеты успешно добавлены!');

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    }

    static async delete(req: RequestWithUser, res: Response, next: NextFunction) {
        const transaction: Transaction = await SequelizeConnect.transaction();
        try {
            const { query: { id } } = req;
            if (typeof id === 'string') {
                await AudienceBusinessService.delete(id.split(','), transaction);
                res.json('Кабинеты успешно удалены!');

            } else {
                res.status(400).json('Неверный id!');
            }
            await transaction.commit();

        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    }

    static async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            res.json(await AudienceBusinessService.getAll());
        } catch (err) {
            next(err);
        }
    }
}