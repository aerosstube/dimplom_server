import { NextFunction, Response } from 'express';
import { Transaction } from 'sequelize';

import { RequestWithUser } from '../../../middlewares/auth-middleware';
import { SequelizeConnect } from '../../../services/database-connect';
import { GroupBusinessService } from '../../../services/group-services/group.business.service';

export class GroupController {
	static async createOrUpdate(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const transaction: Transaction = await SequelizeConnect.transaction();
		try {
			const {
				body: { groupOptions },
			} = req;
			await GroupBusinessService.createOrUpdate(groupOptions, transaction);

			res.json('Группы успешно добавлены/обновлены!');
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
				await GroupBusinessService.delete(id.split(','), transaction);
				res.json('Группа успешно удалены!');
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
				query: { findWord },
			} = req;
			// @ts-ignore
			res.json(await GroupBusinessService.getAll(findWord));
		} catch (err) {
			next(err);
		}
	}
}
