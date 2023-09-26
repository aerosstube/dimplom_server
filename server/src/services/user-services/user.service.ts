import { hash } from 'bcryptjs';
import { Op } from 'sequelize';
import { Transaction } from 'sequelize';

import { users } from '../../../models/users';
import { ApiError } from '../../errors/api.error';
import { RegistrationUserOptions } from '../auth-services/auth.business.service';
import { AuthService } from '../auth-services/auth.service';
import { GroupDatabaseService } from '../group-services/group.database.service';
import { GroupService } from '../group-services/group.service';
import { StudentDatabaseService } from '../student-services/student.database.service';
import { StudentService } from '../student-services/student.service';
import { TeacherDatabaseService } from '../teacher-service/teacher.database.service';
import { TeacherService } from '../teacher-service/teacher.service';
import { UserGroupOptions } from '../userGroups-services/userGroups.database.service';
import { UserGroupsService } from '../userGroups-services/userGroups.service';
import { UserDatabaseService } from './user.database.service';

export class UserService {
	static async getByLogin(login: string): Promise<users> {
		const user: users | null = await UserDatabaseService.findUserByLogin(login);

		if (!user) throw ApiError.BadRequest('Логин не существует!');

		return user;
	}

	static async createUser(
		registrationOptions: RegistrationUserOptions,
		transaction: Transaction
	): Promise<users> {
		registrationOptions.password = await hash(registrationOptions.password, 4);

		return await UserDatabaseService.createUser(
			registrationOptions,
			transaction
		);
	}

	static async userDistribution(
		registrationOptions: {
			groupId: number[];
			isTeacher: boolean;
			classIds?: number[];
		},
		userId: number,
		transaction: Transaction
	): Promise<void> {
		const userGroupOptions: UserGroupOptions = {
			groupId: registrationOptions.groupId,
			classIds: registrationOptions.classIds,
			userId: userId,
		};

		await UserGroupsService.userGroupDistribution(
			registrationOptions.isTeacher,
			userGroupOptions,
			transaction
		);
	}

	static async getUser(id: number): Promise<users> {
		const user = await UserDatabaseService.findUserById(id);
		if (!user) throw ApiError.BadRequest('Неверный пользователь!');

		return user;
	}

	static async getUserByFullName(fullName: string) {
		const user = await UserDatabaseService.findUserByFullName(
			fullName.split(' ')
		);

		if (!user) throw ApiError.BadRequest('Неверное ФИО!');

		return user;
	}

	static async getOptions() {
		return {
			role: [
				{
					name: 'USER',
				},
				{
					name: 'ADMIN',
				},
			],
			groups: await GroupService.getAll(),
		};
	}

	static async getAll(filters?: { isStudent?: boolean; groupName?: string }) {
		const users = await UserDatabaseService.findAll();

		const userOptions = await this.createUserOptions(
			users,
			filters?.isStudent,
			filters?.groupName
		);
		return userOptions;
	}

	static async createUserOptions(
		users: any[],
		isStudent?: boolean,
		groupName?: string
	) {
		const usersOptions = [];
		let i = 0;
		for (const user of users) {
			const teacher = await TeacherDatabaseService.findTeacherByUserId(user.id);
			if (
				isStudent !== undefined &&
				((isStudent && !!teacher) || (!isStudent && !teacher))
			)
				continue;
			const userGroups = await GroupService.getByUserId(user.id, !!teacher);
			let groups;
			if (typeof groupName === 'string') {
				groups = await GroupDatabaseService.findBySmth({
					where: { name: { [Op.like]: `${groupName}%` } },
				});
				let temp = false;
				for (const group of groups) {
					for (const userGroup of userGroups) {
						if (group.id === userGroup.id || group.id === userGroup.group_id) {
							temp = true;
						}
					}
					if (temp) {
						groups = userGroups;
						break;
					} else {
						groups = [];
					}
				}
			}

			if (typeof groupName === 'string' && !groups[0]) {
				continue;
			}
			usersOptions.push({
				id: user.id,
				firstName: user.first_name,
				secondName: user.second_name,
				middleName: user.middle_name,
				dateOfBirthday: user.date_birthday,
				mobilePhone: user.mobile_phone,
				eMail: user['e-mail'],
				role: user.role,
				login: user.login,
				isTeacher: !!teacher,
				group: groups ? groups : userGroups,
			});
			if (!!teacher) {
				usersOptions[i].classes = await TeacherService.getTeacherClasses(
					teacher.id
				);
			} else {
				const student = await StudentDatabaseService.findStudentById(user.id);
				usersOptions[i].is_expelled = student.is_expelled;
			}
			i += 1;
		}
		return usersOptions;
	}

	static async delete(
		userIds: string[],
		transaction: Transaction
	): Promise<boolean> {
		for (const userId of userIds) {
			const user = await this.getUser(parseInt(userId));
			const isTeacherDeleted = await TeacherService.delete(
				{ where: { user_id: parseInt(userId) } },
				transaction
			);
			const isStudentDeleted = await StudentService.delete(
				{ where: { user_id: parseInt(userId) } },
				transaction
			);
			const isTokenDeleted = await AuthService.deleteTokenByUserId(
				parseInt(userId),
				transaction
			);
			if (isTeacherDeleted && isStudentDeleted && isTokenDeleted) {
				await user.destroy({ transaction });
			}
		}
		return true;
	}

	static async getById(userId: number) {
		return await users.findOne({ where: { id: userId } });
	}

	static async getByPhone(phone: string) {
		const user = await users.findOne({
			where: { mobile_phone: '+' + phone.trim() },
		});

		if (user) throw ApiError.BadRequest('Такой телефон уже существует!');
		return user;
	}
}
