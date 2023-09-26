import { marks } from "../../../models/marks";
import { ApiError } from "../../errors/api.error";
import { MarkDatabaseService } from "./mark.database.service";
import { Transaction } from "sequelize";

export class MarkService {
  static async getMarks(
    studentIdFK: number,
    startOfWeek: Date
  ): Promise<marks[]> {
    return await MarkDatabaseService.getMarksForStudent(
      studentIdFK,
      startOfWeek
    );
  }

  static async getMarkById(markId: number): Promise<marks> {
    const mark = await MarkDatabaseService.findMarkById(markId);

    if (!mark) throw ApiError.BadRequest("Такой оценки не существует!");

    return mark;
  }

  static async delete(findObj: { where: {} }, transaction: Transaction) {
    const marks = await MarkDatabaseService.findAllBySmth(findObj);
    for (const mark of marks) {
      await mark.destroy({ transaction });
    }
    return true;
  }
}
