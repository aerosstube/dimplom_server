import { marks } from "../../../models/marks";
import { students } from "../../../models/students";
import { users } from "../../../models/users";

export class StudentDatabaseService {
    static async findStudentById(userId: number): Promise<null | students> {
        return await students.findOne({
            where: {
                user_id: userId,
            },
        });
    }

    static async findStudentUser(groupId: number, classId: number) {
        return await students.findAll({
            where: {
                group_id: groupId,
            },
            attributes: [[`id`, `student_id`], `user_id`, `is_expelled`],
            include: [
                {
                    model: users,
                    as: `user`,
                    attributes: [`first_name`, `second_name`, `middle_name`],
                    order: [`second_name`, `ASC`],
                },
                {
                    model: marks,
                    where: {
                        two_our_class_id: classId,
                    },
                    as: `marks`,
                    attributes: [`id`, `mark`, `two_our_class_id`, `date`],
                },
            ],
        });
    }

    static async findGroupStudents(groupId: number) {
        return await students.findAll({
            where: {
                group_id: groupId,
            },
            attributes: [[`id`, `student_id`], `user_id`, "is_expelled"],
            include: [
                {
                    model: users,
                    as: `user`,
                    attributes: [`first_name`, `second_name`, `middle_name`],
                },
            ],
            order: [[`user`, `second_name`, `ASC`]],
        });
    }

    static async findAllBySmth(findObj: { where: {} }) {
        return await students.findAll(findObj);
    }
}
