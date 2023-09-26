import { Transaction } from 'sequelize';

import { two_our_class } from '../../../models/init-models';
import { ApiError } from '../../errors/api.error';
import { MarkService } from '../mark-services/mark.service';
import { ScheduleService } from '../schedule-services/schedule.service';
import { TeacherHasClassesService } from '../teacherhasClassses-services/teacherHasClasses.service';
import { TwoHouClassOptions } from './twoHourClass.business.service';
import { TwoHourClassDatabaseService } from './twoHourClass.database.service';

export class TwoHourClassService {
	static async getTwoHourClass(id: number): Promise<two_our_class> {
		const twoHourClass = await TwoHourClassDatabaseService.findTwoHourClassById(
			id
		);

		if (!twoHourClass) throw ApiError.BadRequest('Такой пары не существует!');

		return twoHourClass;
	}

	static async getTwoHourClassByName(name: string): Promise<two_our_class> {
		const twoHourClass =
			await TwoHourClassDatabaseService.findTwoHourClassByName(name);

		if (!twoHourClass) throw ApiError.BadRequest('Такой пары не существует!');

		return twoHourClass;
	}

	static async getAll(findObj?: { where: {} }) {
		return await two_our_class.findAll(findObj);
	}

	static async create(name: string, transaction: Transaction) {
		const twoOurClass =
			await TwoHourClassDatabaseService.findTwoHourClassByName(name);
		if (twoOurClass) {
			throw ApiError.BadRequest('Дубликат!');
		}
		await two_our_class.create({ name }, { transaction });
	}

	static async update(
		twoHouClassOptions: TwoHouClassOptions,
		transaction: Transaction
	) {
		const twoOurClass = await this.getTwoHourClass(twoHouClassOptions.id);
		twoOurClass.name = twoHouClassOptions.name;
		await twoOurClass.save({ transaction });
	}

	static async delete(id: number, transaction: Transaction) {
		const findObj = { where: { two_our_class_id: id } };
		const isScheduleDeleted = await ScheduleService.delete(
			findObj,
			transaction
		);
		const isMarkDeleted = await MarkService.delete(findObj, transaction);
		const isTeacherHasClassesDeleted = await TeacherHasClassesService.delete(
			{ where: { two_our_class_id_fk: id } },
			transaction
		);
		if (isScheduleDeleted && isTeacherHasClassesDeleted && isMarkDeleted) {
			const twoHourClass = await this.getTwoHourClass(id);
			await twoHourClass.destroy({ transaction });
		}
	}
}
