import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { schedule, scheduleId } from './schedule';
import type { students, studentsId } from './students';
import type { teacher_has_group, teacher_has_groupId } from './teacher_has_group';

export interface groupsAttributes {
  id: number;
  name: string;
}

export type groupsPk = "id";
export type groupsId = groups[groupsPk];
export type groupsOptionalAttributes = "id";
export type groupsCreationAttributes = Optional<groupsAttributes, groupsOptionalAttributes>;

export class groups extends Model<groupsAttributes, groupsCreationAttributes> implements groupsAttributes {
  id!: number;
  name!: string;

  // groups hasMany schedule via group_id
  schedules!: schedule[];
  getSchedules!: Sequelize.HasManyGetAssociationsMixin<schedule>;
  setSchedules!: Sequelize.HasManySetAssociationsMixin<schedule, scheduleId>;
  addSchedule!: Sequelize.HasManyAddAssociationMixin<schedule, scheduleId>;
  addSchedules!: Sequelize.HasManyAddAssociationsMixin<schedule, scheduleId>;
  createSchedule!: Sequelize.HasManyCreateAssociationMixin<schedule>;
  removeSchedule!: Sequelize.HasManyRemoveAssociationMixin<schedule, scheduleId>;
  removeSchedules!: Sequelize.HasManyRemoveAssociationsMixin<schedule, scheduleId>;
  hasSchedule!: Sequelize.HasManyHasAssociationMixin<schedule, scheduleId>;
  hasSchedules!: Sequelize.HasManyHasAssociationsMixin<schedule, scheduleId>;
  countSchedules!: Sequelize.HasManyCountAssociationsMixin;
  // groups hasMany students via group_id
  students!: students[];
  getStudents!: Sequelize.HasManyGetAssociationsMixin<students>;
  setStudents!: Sequelize.HasManySetAssociationsMixin<students, studentsId>;
  addStudent!: Sequelize.HasManyAddAssociationMixin<students, studentsId>;
  addStudents!: Sequelize.HasManyAddAssociationsMixin<students, studentsId>;
  createStudent!: Sequelize.HasManyCreateAssociationMixin<students>;
  removeStudent!: Sequelize.HasManyRemoveAssociationMixin<students, studentsId>;
  removeStudents!: Sequelize.HasManyRemoveAssociationsMixin<students, studentsId>;
  hasStudent!: Sequelize.HasManyHasAssociationMixin<students, studentsId>;
  hasStudents!: Sequelize.HasManyHasAssociationsMixin<students, studentsId>;
  countStudents!: Sequelize.HasManyCountAssociationsMixin;
  // groups hasMany teacher_has_group via group_id
  teacher_has_groups!: teacher_has_group[];
  getTeacher_has_groups!: Sequelize.HasManyGetAssociationsMixin<teacher_has_group>;
  setTeacher_has_groups!: Sequelize.HasManySetAssociationsMixin<teacher_has_group, teacher_has_groupId>;
  addTeacher_has_group!: Sequelize.HasManyAddAssociationMixin<teacher_has_group, teacher_has_groupId>;
  addTeacher_has_groups!: Sequelize.HasManyAddAssociationsMixin<teacher_has_group, teacher_has_groupId>;
  createTeacher_has_group!: Sequelize.HasManyCreateAssociationMixin<teacher_has_group>;
  removeTeacher_has_group!: Sequelize.HasManyRemoveAssociationMixin<teacher_has_group, teacher_has_groupId>;
  removeTeacher_has_groups!: Sequelize.HasManyRemoveAssociationsMixin<teacher_has_group, teacher_has_groupId>;
  hasTeacher_has_group!: Sequelize.HasManyHasAssociationMixin<teacher_has_group, teacher_has_groupId>;
  hasTeacher_has_groups!: Sequelize.HasManyHasAssociationsMixin<teacher_has_group, teacher_has_groupId>;
  countTeacher_has_groups!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof groups {
    return groups.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'groups',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "table_name_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
