import { hash } from 'bcryptjs';
import { Transaction } from 'sequelize';

import { ApiError } from '../../errors/api.error';
import { RegistrationUserOptions } from '../auth-services/auth.business.service';
import { StudentService } from '../student-services/student.service';
import { TeacherService } from '../teacher-service/teacher.service';
import { TeacherHasGroupService } from '../teacherHasGroup-services/teacherHasGroup.service';
import { TeacherHasClassesService } from '../teacherhasClassses-services/teacherHasClasses.service';
import { UserDatabaseService } from './user.database.service';
import { UserService } from './user.service';

export class UserBusinessService {
	static async getAll(filter?: { isStudent: boolean; groupName: string }) {
		return await UserService.getAll(filter);
	}

	static async update(
		teacherInfo: { groupIds: number[]; classesIds: number[] },
		registrationOptions: RegistrationUserOptions,
		transaction: Transaction
	): Promise<void> {
		const user = await UserService.getUser(registrationOptions.userId);
		const teacher = await TeacherService.getBySmth({
			where: { user_id: registrationOptions.userId },
		});

		if (teacher[0]) {
			await TeacherHasGroupService.update(
				{ teacherId: teacher[0].id, groupIds: teacherInfo.groupIds },
				transaction
			);
			await TeacherHasClassesService.update(
				{ teacherId: teacher[0].id, classIds: teacherInfo.classesIds },
				transaction
			);
		} else {
			const student = await StudentService.getStudentGroup(
				registrationOptions.userId
			);
			student.group_id = teacherInfo?.groupIds[0];
			student.is_expelled = registrationOptions?.is_expelled;
			await student.save({ transaction });
		}

		user.login = registrationOptions.login;
		user.password = registrationOptions.password
			? await hash(registrationOptions.password, 4)
			: user.password;
		user.first_name = registrationOptions.fullName.split(' ')[1];
		user.second_name = registrationOptions.fullName.split(' ')[0];
		user.middle_name = registrationOptions.fullName.split(' ')[2]
			? registrationOptions.fullName.split(' ')[2]
			: '';
		user.mobile_phone = registrationOptions.mobile_phone;
		user['e-mail'] = registrationOptions['e-mail'];
		user.date_birthday = registrationOptions.dateOfBirthday;
		user.role = registrationOptions.role;
		await user.save({ transaction });
	}

	static async delete(userIds: string[], transaction: Transaction) {
		await UserService.delete(userIds, transaction);
	}

	static async checkPhone(phone: string) {
		return !!(await UserService.getByPhone(phone));
	}

	static async checkLogin(login: string) {
		const user = await UserDatabaseService.findUserByLogin(login);
		if (user) throw ApiError.BadRequest('Такой логин уде существует!');

		return !!user;
	}
}
