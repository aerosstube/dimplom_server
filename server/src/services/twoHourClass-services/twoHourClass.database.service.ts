import { two_our_class } from '../../../models/init-models';


export class TwoHourClassDatabaseService {

    static async findTwoHourClassById(id: number): Promise<two_our_class | null> {
        return await two_our_class.findOne({
            where: {
                id: id,
            },
        });
    }

    static async findTwoHourClassByName(name: string): Promise<two_our_class | null> {
        return await two_our_class.findOne({
            where: {
                name,
            },
        });
    }
}