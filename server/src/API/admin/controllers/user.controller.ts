import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';

import { RequestWithUser } from '../../../middlewares/auth-middleware';
import {
	AuthBusinessService,
	RegistrationUserOptions,
} from '../../../services/auth-services/auth.business.service';
import { AuthService } from '../../../services/auth-services/auth.service';
import { SequelizeConnect } from '../../../services/database-connect';
import { UserBusinessService } from '../../../services/user-services/user.business.service';
import { UserService } from '../../../services/user-services/user.service';

export class UserController {
	static async userRegistrationOrUpdate(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const transaction: Transaction = await SequelizeConnect.transaction();
		try {
			const {
				body: { user },
			} = req;

			const registrationOptions: RegistrationUserOptions =
				await AuthService.createRegistrationUserOptions(user);

			if (!user.id) {
				await AuthBusinessService.userRegistration(
					user.groupId,
					user.classesIds,
					registrationOptions,
					transaction
				);
			} else {
				await UserBusinessService.update(
					{ groupIds: user.groupId, classesIds: user.classesIds },
					registrationOptions,
					transaction
				);
			}

			await transaction.commit();
			res.json('Пользователь успешно зарегистрирован!');
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}

	static async getOptions(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const userOptions = await UserService.getOptions();
			res.json({ userOptions });
		} catch (err) {
			next(err);
		}
	}

	static async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			const {
				query: { isStudent, groupName },
			} = req;
			let users;
			if (typeof isStudent === 'string' || typeof groupName === 'string') {
				users = await UserBusinessService.getAll({
					// @ts-ignore
					isStudent:
						// @ts-ignore
						isStudent === undefined ? undefined : JSON.parse(isStudent),
					// @ts-ignore
					groupName,
				});
				res.json({ users });
			} else {
				users = await UserBusinessService.getAll();
				res.json({ users });
			}
		} catch (err) {
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
				await UserBusinessService.delete(id.split(','), transaction);
				res.json('Пользователь удален!');
			} else {
				res.status(400).json('Ошибка id!');
			}
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}

	static async checkLogin(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const {
				query: { login },
			} = req;
			if (typeof login === 'string') {
				res.json(await UserBusinessService.checkLogin(login));
			} else {
				res.status(401).json('Неверный логин!');
			}
		} catch (err) {
			next(err);
		}
	}

	static async checkPhone(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const {
				query: { phone },
			} = req;

			if (typeof phone === 'string') {
				res.json(await UserBusinessService.checkPhone(phone));
			} else {
				res.status(401).json('Неверный телефон!');
			}
		} catch (err) {
			next(err);
		}
	}
}
