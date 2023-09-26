import { weekdays } from '../../../models/weekdays';


export class WeekdayDatabaseService {
    static async getWeekDayById(id: number): Promise<null | weekdays> {
        return await weekdays.findOne({
            where: {
                id: id,
            },
        });
    }

}