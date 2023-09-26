import { Transaction } from 'sequelize';

import { students } from '../../../models/students';
import { ApiError } from '../../errors/api.error';
import { MarkDatabaseService } from '../mark-services/mark.database.service';
import { MarkService } from '../mark-services/mark.service';
import { StudentDatabaseService } from './student.database.service';

export class StudentService {
	static async getStudentGroup(userId: number) {
		return await students.findOne({
			where: {
				user_id: userId,
			},
		});
	}

	static async getStudentByUserId(userId: number): Promise<students> {
		const student = await StudentDatabaseService.findStudentById(userId);

		return student;
	}

	static async getUserStudent(
		groupId: number,
		classId: number
	): Promise<unknown> {
		const students = await StudentDatabaseService.findStudentUser(
			groupId,
			classId
		);
		const groupStudents = await StudentDatabaseService.findGroupStudents(
			groupId
		);

		for (let i = 0; i < groupStudents.length; i++) {
			for (let j = 0; j < students.length; j++) {
				if (students[j].user_id === groupStudents[i].user_id) {
					// @ts-ignore
					groupStudents[i].dataValues.marks = students[j].marks;
					// @ts-ignore
					await this.getAvgMark(groupStudents[i].dataValues);
					break;
				}
			}
		}
		if (!students) throw ApiError.BadRequest('Вы не студент!');

		return { groupStudents };
	}

	static async getAvgMark(marks: any) {
		let avgMark = 0;
		let n = 0;

		for (const mark of marks.marks) {
			if (!isNaN(parseInt(mark.dataValues.mark))) {
				avgMark += parseInt(mark.dataValues.mark);
				n += 1;
			}
		}

		if (n > 0) {
			marks.avgMark = (avgMark / n).toFixed(2);
		} else {
			marks.avgMark = '';
		}
		return marks;
	}

	static async getAllMarks(studentId: number) {
		return await MarkDatabaseService.findMarksByStudentId(studentId);
	}

	static async getAllMisses(userId: number) {
		const student = await this.getStudentByUserId(userId);
		return await MarkDatabaseService.findMissesByStudentId(student.id);
	}

	static async delete(findObj: { where: {} }, transaction: Transaction) {
		const students = await StudentDatabaseService.findAllBySmth(findObj);
		for (const student of students) {
			const isMarkDeleted: boolean = await MarkService.delete(
				{ where: { student_id: student.id } },
				transaction
			);
			if (isMarkDeleted) await student.destroy({ transaction });
		}

		return true;
	}
}
