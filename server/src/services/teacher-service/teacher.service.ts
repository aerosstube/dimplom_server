import { Transaction } from 'sequelize';

import { marks } from '../../../models/marks';
import { teacher_has_classes } from '../../../models/teacher_has_classes';
import { teachers } from '../../../models/teachers';
import { users } from '../../../models/users';
import { ApiError } from '../../errors/api.error';
import { MarkDatabaseService } from '../mark-services/mark.database.service';
import { MarkService } from '../mark-services/mark.service';
import { ScheduleDatabaseService } from '../schedule-services/schedule.database.service';
import { ScheduleService } from '../schedule-services/schedule.service';
import { TeacherHasGroupService } from '../teacherHasGroup-services/teacherHasGroup.service';
import { TeacherHasClassesService } from '../teacherhasClassses-services/teacherHasClasses.service';
import { UserService } from '../user-services/user.service';
import { TeacherDatabaseService } from './teacher.database.service';

export class TeacherService {
	static async getTeacher(id: number): Promise<users> {
		const teacher = await TeacherDatabaseService.findTeacherById(id);

		if (!teacher) throw ApiError.BadRequest('Неверный учитель!');

		return UserService.getUser(teacher.user_id);
	}

	static async getTeacherByUserId(userId: number): Promise<teachers | null> {
		const teacher = await TeacherDatabaseService.findTeacherByUserId(userId);

		if (!teacher) throw ApiError.BadRequest('Неверный учитель');

		return teacher;
	}

	static async isUserTeacher(userId: number): Promise<boolean> {
		const teacher = await TeacherDatabaseService.findTeacherByUserId(userId);

		return !!teacher;
	}

	static async updateStudentMark(
		markId: number,
		updatedMark: string,
		transaction: Transaction
	): Promise<void> {
		const mark = await MarkService.getMarkById(markId);
		await MarkDatabaseService.saveMark(
			{
				updatedMark,
				mark,
			},
			transaction
		);
	}

	static async deleteStudentMark(
		markId: number,
		transaction: Transaction
	): Promise<void> {
		await marks.destroy({
			where: {
				id: markId,
			},
			transaction,
		});
	}

	static async saveStudentMark(
		options: {
			updatedMark: string;
			studentId: number;
			classId: number;
			date: string;
		},
		transaction: Transaction
	): Promise<marks> {
		return await MarkDatabaseService.saveMark(
			{
				updatedMark: options.updatedMark,
				studentId: options.studentId,
				classId: options.classId,
				date: new Date(options.date),
			},
			transaction
		);
	}

	static async getTeacherClasses(
		teacherId: number
	): Promise<teacher_has_classes[]> {
		const teacherClasses = await TeacherDatabaseService.findTeacherClasses(
			teacherId
		);

		return teacherClasses;
	}

	static async getTeacherGroups(teacherId: number) {
		const teacherGroups = await TeacherDatabaseService.findTeacherGroups(
			teacherId
		);

		return teacherGroups;
	}

	static async getClassesForMarks(groupId: number, classId: number) {
		const schedule = await ScheduleDatabaseService.getDates(groupId, classId);
		if (schedule[0] === undefined)
			throw ApiError.BadRequest('Неверный запрос!');

		return schedule;
	}

	static async getAll() {
		return teachers.findAll({
			attributes: ['id'],
			include: [
				{
					model: users,
					as: `user`,
					attributes: ['id', 'first_name', 'second_name', 'middle_name'],
					order: [['second_name', 'ASC']],
				},
			],
		});
	}

	static async getBySmth(findObj: any) {
		return await TeacherDatabaseService.getBySmth(findObj);
	}

	static async delete(
		findObj: { where: {} },
		transaction: Transaction
	): Promise<boolean> {
		const teachers = await this.getBySmth(findObj);

		for (const teacher of teachers) {
			const isTeacherHasGroupDeleted =
				await TeacherHasGroupService.deleteTeacherHasGroup(
					{ where: { teacher_id: teacher.id } },
					transaction
				);
			const isTeacherHasClassesDelted = await TeacherHasClassesService.delete(
				{ where: { teacher_id_fk: teacher.id } },
				transaction
			);
			const isScheduleDelete = await ScheduleService.delete(
				{ where: { teacher_id: teacher.id } },
				transaction
			);

			if (
				isTeacherHasGroupDeleted &&
				isTeacherHasClassesDelted &&
				isScheduleDelete
			) {
				await teacher.destroy({ transaction });
			}
		}

		return true;
	}
}
