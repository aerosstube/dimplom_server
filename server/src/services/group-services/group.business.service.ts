import { Transaction } from 'sequelize';

import { groups } from '../../../models/groups';
import { GroupService } from './group.service';

export interface GroupOptions {
	id?: number;
	name: string;
}

export class GroupBusinessService {
	static async getAll(findWord?: string): Promise<groups[]> {
		return await GroupService.getAll(findWord);
	}

	static async createOrUpdate(
		groupOptions: GroupOptions,
		transaction: Transaction
	): Promise<void> {
		if (!groupOptions.id) {
			await GroupService.create(groupOptions.name, transaction);
		} else {
			await GroupService.update(groupOptions, transaction);
		}
	}

	static async delete(ids: string[], transaction: Transaction): Promise<void> {
		for (const id of ids) {
			await GroupService.delete(parseInt(id), transaction);
		}
	}
}
