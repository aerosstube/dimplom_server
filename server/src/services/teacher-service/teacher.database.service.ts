import { groups } from '../../../models/groups';
import { teacher_has_classes } from '../../../models/teacher_has_classes';
import { teacher_has_group } from '../../../models/teacher_has_group';
import { teachers } from '../../../models/teachers';

export class TeacherDatabaseService {
	static async getBySmth(findObj: any) {
		return await teachers.findAll(findObj);
	}
	static async findTeacherById(id: number) {
		return await teachers.findOne({
			where: {
				id: id,
			},
		});
	}

	static async findTeacherByName(userId: number): Promise<teachers | null> {
		return await teachers.findOne({
			where: {
				user_id: userId,
			},
		});
	}

	static async findTeacherClasses(
		teacherId: number
	): Promise<teacher_has_classes[] | null> {
		return await teacher_has_classes.findAll({
			where: {
				teacher_id_fk: teacherId,
			},
		});
	}

	static async findTeacherGroups(
		teacherId: number
	): Promise<teacher_has_group[] | null> {
		return await teacher_has_group.findAll({
			where: {
				teacher_id: teacherId,
			},
			include: [
				{
					model: groups,
					as: 'group',
					attributes: ['name'],
				},
			],
		});
	}

	static async findTeacherByUserId(userId: number): Promise<teachers | null> {
		return await teachers.findOne({
			where: {
				user_id: userId,
			},
		});
	}
}
