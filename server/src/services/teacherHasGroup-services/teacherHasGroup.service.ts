import { TeacherHasGroupDatabaseService } from "./teacherHasGroup.database.service";
import { Transaction } from "sequelize";
import { UserGroupsDatabaseService } from "../userGroups-services/userGroups.database.service";

export class TeacherHasGroupService {
    static async update(
        teacherGroupOptions: {
            teacherId: number;
            groupIds: number[];
        },
        transaction: Transaction
    ) {
        const isTeacherHasGroupDeleted = await this.deleteTeacherHasGroup(
            { where: { teacher_id: teacherGroupOptions.teacherId } },
            transaction
        );
        if (isTeacherHasGroupDeleted) {
            for (const groupId of teacherGroupOptions.groupIds) {
                await UserGroupsDatabaseService.addTeacherRealation(
                    { teacherId: teacherGroupOptions.teacherId, groupId },
                    transaction
                );
            }
        }
    }

    static async deleteTeacherHasGroup(
        obj: { where: {} },
        transaction: Transaction
    ) {
        const teacherHasGroups = await TeacherHasGroupDatabaseService.findAllBySmth(
            obj
        );
        for (const teacherHasGroup of teacherHasGroups) {
            await teacherHasGroup.destroy({ transaction });
        }
        return true;
    }
}
