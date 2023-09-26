import { group } from 'console';
import { Op } from 'sequelize';
import { Transaction } from 'sequelize';

import { groups } from '../../../models/groups';
import { ApiError } from '../../errors/api.error';
import { ScheduleService } from '../schedule-services/schedule.service';
import { StudentService } from '../student-services/student.service';
import { TeacherService } from '../teacher-service/teacher.service';
import { TeacherHasGroupService } from '../teacherHasGroup-services/teacherHasGroup.service';
import { GroupOptions } from './group.business.service';
import { GroupDatabaseService } from './group.database.service';

export class GroupService {
	static async getById(id: number): Promise<groups> {
		const group = await GroupDatabaseService.findGroupById(id);

		if (!group) throw ApiError.BadRequest('Такой группы не существует!');

		return group;
	}

	static async getGroupByName(name: string): Promise<groups> {
		const group = await GroupDatabaseService.findGroupByName(name);

		if (!group) throw ApiError.BadRequest('Такой группы не существует!');

		return group;
	}

	static async getAll(findWord?: string) {
		if (findWord) {
			return await groups.findAll({
				where: {
					name: {
						[Op.like]: `${findWord}%`,
					},
				},
				order: [['name', 'ASC']],
			});
		} else {
			return groups.findAll({
				order: [['name', 'ASC']],
			});
		}
	}

	static async create(name: string, transaction: Transaction) {
		const group = await GroupDatabaseService.findGroupByName(name);
		if (group) {
			throw ApiError.BadRequest('Дубликат!');
		}
		await groups.create({ name }, { transaction });
	}

	static async update(groupOptions: GroupOptions, transaction: Transaction) {
		const group = await this.getById(groupOptions.id);
		group.name = groupOptions.name;
		await group.save({ transaction });
	}

	static async delete(id: number, transaction: Transaction) {
		const findObj = { where: { group_id: id } };
		const isScheduleDeleted = await ScheduleService.delete(
			findObj,
			transaction
		);
		const isTeacherHasGroupDeleted =
			await TeacherHasGroupService.deleteTeacherHasGroup(findObj, transaction);
		const isStudentsDeleted = await StudentService.delete(findObj, transaction);
		if (isScheduleDeleted && isTeacherHasGroupDeleted && isStudentsDeleted) {
			const group = await this.getById(id);
			await group.destroy({ transaction });
		}
	}

	static async getByUserId(userId: number, isTeacher: boolean): Promise<any[]> {
		if (isTeacher) {
			const teacher = await TeacherService.getTeacherByUserId(userId);
			return await TeacherService.getTeacherGroups(teacher.id);
		} else {
			const student = await StudentService.getStudentByUserId(userId);
			return await groups.findAll({
				where: { id: student.group_id },
			});
		}
	}
}
