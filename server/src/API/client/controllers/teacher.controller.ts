import { NextFunction, Response } from 'express';
import { Transaction } from 'sequelize';

import { ApiError } from '../../../errors/api.error';
import { RequestWithUser } from '../../../middlewares/auth-middleware';
import { SequelizeConnect } from '../../../services/database-connect';
import { TeacherBusinessService } from '../../../services/teacher-service/teacher.business.service';

export class TeacherController {
	static async getGroupMarks(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const {
				query: { classId, groupId },
			} = req;

			if (typeof classId !== 'string')
				return next(ApiError.BadRequest('Неверный запрос!'));

			await TeacherBusinessService.checkTeacherLesson(
				req.user.userId,
				parseInt(classId)
			);

			if (typeof groupId !== 'string')
				return next(ApiError.BadRequest('Неверный запрос!'));

			const studentMarks = await TeacherBusinessService.getGroupMarks(
				parseInt(groupId),
				parseInt(classId)
			);
			const classes = await TeacherBusinessService.getClassesForMarks(
				parseInt(groupId),
				parseInt(classId)
			);

			res.json({
				studentMarks,
				classes,
			});
		} catch (err) {
			next(err);
		}
	}

	static async updateStudentMark(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const transaction: Transaction = await SequelizeConnect.transaction();
		try {
			const {
				body: { markId, updatedMark, studentId, classId, date },
				user: { isTeacher },
			} = req;
			if (!isTeacher) return next(ApiError.AcessDenied());

			if (
				updatedMark != '5' &&
				updatedMark != '4' &&
				updatedMark != '3' &&
				updatedMark != '2' &&
				updatedMark != 'Б' &&
				updatedMark != 'П' &&
				updatedMark != 'Н' &&
				updatedMark != undefined &&
				updatedMark != ''
			) {
				return next(ApiError.BadRequest('Неверная оценка!'));
			}

			if (!updatedMark) {
				await TeacherBusinessService.deleteStudentMark(markId, transaction);
				res.json({
					message: 'Оценка удалена!',
				});
			} else if (markId) {
				await TeacherBusinessService.updateStudentMark(
					markId,
					{ updatedMark },
					transaction
				);
				res.json({
					message: 'Оценка изменилась!',
				});
			} else if (!markId) {
				const mark = await TeacherBusinessService.saveStudentMark(
					{
						updatedMark,
						studentId,
						classId,
						date,
					},
					transaction
				);
				res.json({
					markId: mark.id,
				});
			}

			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}

	static async getAllowedGroups(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const { user } = req;
			const groups = await TeacherBusinessService.getAllowedGroups(user.userId);

			res.json({ groups });
		} catch (err) {
			next(err);
		}
	}

	static async getAllowedClasses(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		try {
			const { user } = req;
			const classes = await TeacherBusinessService.getAllowedClasses(
				user.userId
			);

			res.json({ classes });
		} catch (err) {
			next(err);
		}
	}

	static async updateSchedule(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const transaction = await SequelizeConnect.transaction();
		try {
			const {
				body: { scheduleInfo },
				user,
			} = req;
			await TeacherBusinessService.updateScheduleInfo(
				scheduleInfo,
				user.userId,
				transaction
			);
			res.json('Успешно изменено!');
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}

	static async uploadFile(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const transaction = await SequelizeConnect.transaction();
		try {
			const {
				query: { scheduleId },
				files: { file },
				user,
			} = req;

			if (typeof scheduleId === 'string') {
				const path = await TeacherBusinessService.uploadScheduleFile(
					file,
					user.userId,
					parseInt(scheduleId),
					transaction
				);
				res.json(path);
			} else {
				res.status(400).json('Неверный scheduleId!');
			}
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}
}
