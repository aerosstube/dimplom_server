import { NextFunction, Response } from 'express';
import { Transaction } from 'sequelize';

import { RequestWithUser } from '../../../middlewares/auth-middleware';
import { SequelizeConnect } from '../../../services/database-connect';
import { ScheduleBusinessService } from '../../../services/schedule-services/schedule.business.service';

export class ScheduleController {
	static async createOrUpdate(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const transaction: Transaction = await SequelizeConnect.transaction();
		try {
			const {
				body: { scheduleOptions },
			} = req;
			const errors: number[] = [];
			let error = false;
			for (let i = 0; i < scheduleOptions.length; i++) {
				if (!scheduleOptions[i].id) {
					await ScheduleBusinessService.create(
						scheduleOptions[i],
						error,
						transaction
					);
				} else {
					await ScheduleBusinessService.update(
						scheduleOptions[i],
						errors,
						transaction
					);
				}
			}
			if (error) res.status(401).json('Что-то не создалось!');
			res.status(200).json('Все измененно!');
			await transaction.commit();
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
			res.json(await ScheduleBusinessService.getOptions());
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
				await ScheduleBusinessService.delete(id.split(','), transaction);
				res.json('Расписание удалено!');
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
			const {
				query: { dateOfClass, betweenDates },
			} = req;
			if (typeof dateOfClass === 'string' || typeof betweenDates === 'string')
				res.json(
					await ScheduleBusinessService.getAll({
						dateOfClass: String(dateOfClass),
						betweenDates: String(betweenDates).split(','),
					})
				);
			else res.json(await ScheduleBusinessService.getAll());
		} catch (err) {
			next(err);
		}
	}

	// static async isDuplicate(
	// 	req: RequestWithUser,
	// 	res: Response,
	// 	next: NextFunction
	// ) {
	// 	try {
	// 		const {
	// 			query: { scheduleDates: scheduleDate, teacherId, audienceId },
	// 		} = req;
	//
	// 		if (
	// 			typeof scheduleDate === 'string' &&
	// 			typeof teacherId === 'string' &&
	// 			typeof audienceId === 'string'
	// 		) {
	// 			res.json(
	// 				await ScheduleBusinessService.isDupplicate(
	// 					new Date(scheduleDate),
	// 					parseInt(teacherId),
	// 					parseInt(audienceId)
	// 				)
	// 			);
	// 		}
	// 	} catch (err) {
	// 		next(err);
	// 	}
	// }

	static async getTeacher(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const {
				query: { groupId, lessonId },
			} = req;
			if (!(groupId || lessonId)) {
				res.status(401).json('Оба параметра пустые!');
			}
			res.json({
				teachers: await ScheduleBusinessService.getTeacher({
					//@ts-ignore
					groupId: parseInt(groupId),
					//@ts-ignore
					lessonId: parseInt(lessonId),
				}),
			});
		} catch (err) {
			next(err);
		}
	}

	static async getSubjectsAndGroups(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const {
				query: { teacherId },
			} = req;
			if (teacherId) {
				const data =
					await ScheduleBusinessService.getSubjectsAndGroupsByTeacherId(
						//@ts-ignore
						parseInt(teacherId)
					);
				res.json({
					groups: data[1].teacher_has_groups.map((e) => e.group),
					classes: data[0].teacher_has_classes.map(
						(e) => e.two_our_class_id_fk_two_our_class
					),
				});
			} else {
				res.status(401).json('Неверный teacherId!');
			}
		} catch (err) {
			next(err);
		}
	}
}
