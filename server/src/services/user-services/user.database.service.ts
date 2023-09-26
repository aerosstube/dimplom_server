import { Transaction } from 'sequelize';

import { users } from '../../../models/users';
import { RegistrationUserOptions } from '../auth-services/auth.business.service';

export class UserDatabaseService {
	static async findUserByLogin(login: string): Promise<users | null> {
		return await users.findOne({
			where: {
				login,
			},
		});
	}

	static async findUserById(id: number): Promise<users | null> {
		return await users.findOne({
			where: {
				id: id,
			},
		});
	}

	static async createUser(
		registrationOptions: RegistrationUserOptions,
		transaction: Transaction
	): Promise<users> {
		return await users.create(
			{
				login: registrationOptions.login,
				password: registrationOptions.password,
				first_name: registrationOptions.fullName.split(' ')[1],
				second_name: registrationOptions.fullName.split(' ')[0],
				middle_name: registrationOptions.fullName.split(' ')[2],
				date_birthday: registrationOptions.dateOfBirthday,
				'e-mail': registrationOptions['e-mail'],
				mobile_phone: registrationOptions.mobile_phone,
				role: registrationOptions.role,
			},
			{ transaction }
		);
	}

	static async findUserByFullName(fullName: string[]) {
		return await users.findOne({
			where: {
				first_name: fullName[1],
				second_name: fullName[0],
				middle_name: fullName[2] ? fullName[2] : '',
			},
		});
	}

	static async findAll() {
		return await users.findAll({
			attributes: { exclude: ['password'] },
			order: [['second_name', 'ASC']],
		});
	}
}
