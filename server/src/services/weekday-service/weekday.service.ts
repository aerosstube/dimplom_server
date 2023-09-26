import { weekdays } from '../../../models/weekdays';
import { ApiError } from '../../errors/api.error';
import { WeekdayDatabaseService } from './weekday.database.service';


export class WeekdayService {
    static async getWeekday(id: number): Promise<weekdays> {
        const weekday = await WeekdayDatabaseService.getWeekDayById(id);
        if (!weekday)
            throw ApiError.BadRequest('Такого дня недели не существует!');

        return weekday;
    }

    static async getAll() {
        return weekdays.findAll();
    }
}