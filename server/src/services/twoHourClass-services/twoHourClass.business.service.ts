import { Op } from 'sequelize';
import { Transaction } from 'sequelize';

import { two_our_class } from '../../../models/init-models';
import { TwoHourClassService } from './twoHourClass.service';

export interface TwoHouClassOptions {
	id?: number;
	name: string;
}

export class TwoHourClassBusinessService {
	static async getAll(params: { findWord?: string }): Promise<two_our_class[]> {
		if (params.findWord) {
			return await TwoHourClassService.getAll({
				where: {
					name: {
						[Op.like]: `${params.findWord}%`,
					},
				},
			});
		} else {
			return await TwoHourClassService.getAll();
		}
	}

	static async createOrUpdate(
		twoHourClassOptions: TwoHouClassOptions,
		transaction: Transaction
	): Promise<void> {
		if (!twoHourClassOptions.id) {
			await TwoHourClassService.create(twoHourClassOptions.name, transaction);
		} else {
			await TwoHourClassService.update(twoHourClassOptions, transaction);
		}
	}

	static async delete(ids: string[], transaction: Transaction): Promise<void> {
		for (const id of ids) {
			await TwoHourClassService.delete(parseInt(id), transaction);
		}
	}
}
