import { NextFunction, Response } from 'express';
import { Transaction } from 'sequelize';

import { RequestWithUser } from '../../../middlewares/auth-middleware';
import { SequelizeConnect } from '../../../services/database-connect';
import { TwoHourClassBusinessService } from '../../../services/twoHourClass-services/twoHourClass.business.service';

export class LessonController {
	static async createOrUpdate(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const transaction: Transaction = await SequelizeConnect.transaction();
		try {
			const {
				body: { lessonOptions },
			} = req;
			await TwoHourClassBusinessService.createOrUpdate(
				lessonOptions,
				transaction
			);
			res.json('Уроки успешно добавлены!');
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}

	static async delete(req: RequestWithUser, res: Response, next: NextFunction) {
		const transaction: Transaction = await SequelizeConnect.transaction();
		try {
			const {
				query: { id },
			} = req;
			if (typeof id === 'string') {
				await TwoHourClassBusinessService.delete(id.split(','), transaction);
				res.json('Урок успешно удален!');
			}
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}

	static async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const {
				query: { findString },
			} = req;
			if (typeof findString === 'string') {
				res.json(
					await TwoHourClassBusinessService.getAll({ findWord: findString })
				);
			} else {
				res.json(await TwoHourClassBusinessService.getAll({}));
			}
		} catch (err) {
			next(err);
		}
	}
}
