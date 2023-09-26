import { AudienceService } from './audience.service';
import { audiences } from '../../../models/audiences';
import { Transaction } from 'sequelize';


export interface AudienceOptions {
    id?: number,
    numberAudience: number
}

export class AudienceBusinessService {
    static async getAll(): Promise<audiences[]> {
        return await AudienceService.getAll();
    }

    static async createOrUpdate(audienceOptions: AudienceOptions, transaction: Transaction): Promise<void> {
        if (!audienceOptions.id) {
            await AudienceService.create(audienceOptions.numberAudience, transaction);
        } else {
            await AudienceService.update(audienceOptions, transaction);
        }
    }

    static async delete(ids: string[], transaction: Transaction): Promise<void> {
        for (const id of ids) {
            await AudienceService.delete(parseInt(id), transaction);
        }
    }
}
