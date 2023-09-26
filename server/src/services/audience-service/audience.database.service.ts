import { audiences } from '../../../models/audiences';


export class AudienceDatabaseService {
    static async findAudienceById(id: number) {
        return await audiences.findOne({
            where: {
                id: id,
            },
        });
    }

    static async findAudienceByNumber(numberAudience: number) {
        return await audiences.findOne({
            where: {
                number_audience: numberAudience,

            },
        });
    }
}