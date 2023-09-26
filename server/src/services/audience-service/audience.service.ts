import { Transaction } from 'sequelize';

import { audiences } from '../../../models/audiences';
import { ApiError } from '../../errors/api.error';
import { ScheduleService } from '../schedule-services/schedule.service';
import { AudienceOptions } from './audience.business.service';
import { AudienceDatabaseService } from './audience.database.service';

export class AudienceService {
	static async getAudience(id: number) {
		const audience = await AudienceDatabaseService.findAudienceById(id);
		if (!audience) throw ApiError.BadRequest('Неверный номер аудитории!');

		return audience;
	}

	static async getAll() {
		return await audiences.findAll({
			order: [['number_audience', 'ASC']],
		});
	}

	static async create(
		numberAudience: number,
		transaction: Transaction
	): Promise<void> {
		const audience = await AudienceDatabaseService.findAudienceByNumber(
			numberAudience
		);

		if (audience) {
			throw ApiError.BadRequest('Дубликат!');
		}
		await audiences.create(
			{
				number_audience: numberAudience,
			},
			{ transaction }
		);
	}

	static async update(
		audienceOptions: AudienceOptions,
		transaction: Transaction
	): Promise<void> {
		const audience = await this.getAudience(audienceOptions.id);
		audience.number_audience = audienceOptions.numberAudience;
		await audience.save({ transaction });
	}

	static async delete(id: number, transaction: Transaction) {
		const isScheduleDeleted = await ScheduleService.delete(
			{ where: { audience_id: id } },
			transaction
		);
		if (isScheduleDeleted) {
			const audience = await this.getAudience(id);
			await audience.destroy({ transaction });
		}
	}
}
