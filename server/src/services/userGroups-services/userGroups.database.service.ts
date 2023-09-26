import { Transaction } from "sequelize";
import { students } from "../../../models/students";
import { teachers } from "../../../models/teachers";
import { teacher_has_classes } from "../../../models/teacher_has_classes";
import { teacher_has_group } from "../../../models/teacher_has_group";

export interface UserGroupOptions {
  groupId: number[];
  userId: number;
  classIds?: number[];
}

export class UserGroupsDatabaseService {
  static async addTeacher(
    userGroupOptions: UserGroupOptions,
    transaction: Transaction
  ): Promise<void> {
    const teacher = await teachers.create(
      {
        user_id: userGroupOptions.userId,
      },
      { transaction }
    );
    if (teacher)
      for (const id of userGroupOptions.groupId) {
        await teacher_has_group.create(
          {
            teacher_id: teacher.id,
            group_id: id,
          },
          { transaction }
        );
      }
    for (const classId of userGroupOptions.classIds) {
      await teacher_has_classes.create(
        {
          teacher_id_fk: teacher.id,
          two_our_class_id_fk: classId,
        },
        { transaction }
      );
    }
  }

  static async addTeacherRealation(
    userGroupOptions: { teacherId: number; groupId: number },
    transaction: Transaction
  ) {
    await teacher_has_group.create(
      {
        teacher_id: userGroupOptions.teacherId,
        group_id: userGroupOptions.groupId,
      },
      { transaction }
    );
  }

  static async addStudent(
    userGroupOptions: UserGroupOptions,
    transaction: Transaction
  ): Promise<students> {
    return await students.create(
      {
        user_id: userGroupOptions.userId,
        group_id: userGroupOptions.groupId[0],
      },
      { transaction }
    );
  }
}
