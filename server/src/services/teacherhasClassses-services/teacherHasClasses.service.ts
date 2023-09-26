import { Transaction } from "sequelize";
import { TeacherHasClassesDatabaseService } from "./teacherHasClasses.database.service";

export class TeacherHasClassesService {
  static async update(
    teacherInfo: { teacherId: number; classIds: number[] },
    transaction: Transaction
  ) {
    const isDeleted = await this.delete(
      { where: { teacher_id_fk: teacherInfo.teacherId } },
      transaction
    );

    if (isDeleted) {
      for (const classId of teacherInfo.classIds) {
        await TeacherHasClassesDatabaseService.create(
          { teacherId: teacherInfo.teacherId, classId: classId },
          transaction
        );
      }
    }
  }

  static async delete(obj: { where: {} }, transaction: Transaction) {
    const teacherHasClasses =
      await TeacherHasClassesDatabaseService.findAllBySmth(obj);
    for (const teacherHasClass of teacherHasClasses) {
      await teacherHasClass.destroy({ transaction });
    }
    return true;
  }
}
