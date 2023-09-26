import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { marks, marksId } from './marks';
import type { schedule, scheduleId } from './schedule';
import type { teacher_has_classes, teacher_has_classesId } from './teacher_has_classes';

export interface two_our_classAttributes {
  id: number;
  name: string;
}

export type two_our_classPk = "id";
export type two_our_classId = two_our_class[two_our_classPk];
export type two_our_classOptionalAttributes = "id";
export type two_our_classCreationAttributes = Optional<two_our_classAttributes, two_our_classOptionalAttributes>;

export class two_our_class extends Model<two_our_classAttributes, two_our_classCreationAttributes> implements two_our_classAttributes {
  id!: number;
  name!: string;

  // two_our_class hasMany marks via two_our_class_id
  marks!: marks[];
  getMarks!: Sequelize.HasManyGetAssociationsMixin<marks>;
  setMarks!: Sequelize.HasManySetAssociationsMixin<marks, marksId>;
  addMark!: Sequelize.HasManyAddAssociationMixin<marks, marksId>;
  addMarks!: Sequelize.HasManyAddAssociationsMixin<marks, marksId>;
  createMark!: Sequelize.HasManyCreateAssociationMixin<marks>;
  removeMark!: Sequelize.HasManyRemoveAssociationMixin<marks, marksId>;
  removeMarks!: Sequelize.HasManyRemoveAssociationsMixin<marks, marksId>;
  hasMark!: Sequelize.HasManyHasAssociationMixin<marks, marksId>;
  hasMarks!: Sequelize.HasManyHasAssociationsMixin<marks, marksId>;
  countMarks!: Sequelize.HasManyCountAssociationsMixin;
  // two_our_class hasMany schedule via two_our_class_id
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
  // two_our_class hasMany teacher_has_classes via two_our_class_id_fk
  teacher_has_classes!: teacher_has_classes[];
  getTeacher_has_classes!: Sequelize.HasManyGetAssociationsMixin<teacher_has_classes>;
  setTeacher_has_classes!: Sequelize.HasManySetAssociationsMixin<teacher_has_classes, teacher_has_classesId>;
  addTeacher_has_class!: Sequelize.HasManyAddAssociationMixin<teacher_has_classes, teacher_has_classesId>;
  addTeacher_has_classes!: Sequelize.HasManyAddAssociationsMixin<teacher_has_classes, teacher_has_classesId>;
  createTeacher_has_class!: Sequelize.HasManyCreateAssociationMixin<teacher_has_classes>;
  removeTeacher_has_class!: Sequelize.HasManyRemoveAssociationMixin<teacher_has_classes, teacher_has_classesId>;
  removeTeacher_has_classes!: Sequelize.HasManyRemoveAssociationsMixin<teacher_has_classes, teacher_has_classesId>;
  hasTeacher_has_class!: Sequelize.HasManyHasAssociationMixin<teacher_has_classes, teacher_has_classesId>;
  hasTeacher_has_classes!: Sequelize.HasManyHasAssociationsMixin<teacher_has_classes, teacher_has_classesId>;
  countTeacher_has_classes!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof two_our_class {
    return two_our_class.init({
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
    tableName: 'two_our_class',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "two_our_class_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
