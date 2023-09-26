import { Transaction } from "sequelize";
import { teacher_has_classes } from "../../../models/init-models";

export class TeacherHasClassesDatabaseService {
  static async create(
    teacherInfo: { teacherId: number; classId: number },
    transaction: Transaction
  ) {
    return await teacher_has_classes.create(
      {
        teacher_id_fk: teacherInfo.teacherId,
        two_our_class_id_fk: teacherInfo.classId,
      },
      { transaction }
    );
  }

  static async findAllBySmth(findObj: { where: {} }) {
    return await teacher_has_classes.findAll(findObj);
  }
}
