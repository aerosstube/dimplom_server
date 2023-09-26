import { teacher_has_group } from '../../../models/init-models';


export class TeacherHasGroupDatabaseService {

    static async findAllBySmth(obj: { where: {} }) {
        return await teacher_has_group.findAll(obj);
    }
}