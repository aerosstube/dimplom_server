import { groups } from '../../../models/groups';

export class GroupDatabaseService {
    static async findBySmth(findObj: { where: {} }) {
        const group = await groups.findAll(findObj);
        return group;
    }

    static async findGroupByName(groupName: string): Promise<groups | null> {
        return await groups.findOne({
            where: {
                name: groupName,
            },
        });
    }

    static async findGroupById(id: number): Promise<groups | null> {
        return await groups.findOne({
            where: {
                id: id,
            },
        });
    }
}
