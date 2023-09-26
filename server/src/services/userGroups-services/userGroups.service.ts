import { Transaction } from "sequelize";
import { students } from "../../../models/students";
import {
  UserGroupOptions,
  UserGroupsDatabaseService,
} from "./userGroups.database.service";

export class UserGroupsService {
  static async userGroupDistribution(
    isTeacher: boolean,
    userGroupOptions: UserGroupOptions,
    transaction: Transaction
  ): Promise<void | students> {
    if (isTeacher)
      return await UserGroupsDatabaseService.addTeacher(
        userGroupOptions,
        transaction
      );
    return await UserGroupsDatabaseService.addStudent(
      userGroupOptions,
      transaction
    );
  }
}
