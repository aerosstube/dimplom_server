import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { groups, groupsId } from './groups';
import type { teachers, teachersId } from './teachers';

export interface teacher_has_groupAttributes {
  teacher_id: number;
  group_id: number;
  id: number;
}

export type teacher_has_groupPk = "id";
export type teacher_has_groupId = teacher_has_group[teacher_has_groupPk];
export type teacher_has_groupOptionalAttributes = "id";
export type teacher_has_groupCreationAttributes = Optional<teacher_has_groupAttributes, teacher_has_groupOptionalAttributes>;

export class teacher_has_group extends Model<teacher_has_groupAttributes, teacher_has_groupCreationAttributes> implements teacher_has_groupAttributes {
  teacher_id!: number;
  group_id!: number;
  id!: number;

  // teacher_has_group belongsTo groups via group_id
  group!: groups;
  getGroup!: Sequelize.BelongsToGetAssociationMixin<groups>;
  setGroup!: Sequelize.BelongsToSetAssociationMixin<groups, groupsId>;
  createGroup!: Sequelize.BelongsToCreateAssociationMixin<groups>;
  // teacher_has_group belongsTo teachers via teacher_id
  teacher!: teachers;
  getTeacher!: Sequelize.BelongsToGetAssociationMixin<teachers>;
  setTeacher!: Sequelize.BelongsToSetAssociationMixin<teachers, teachersId>;
  createTeacher!: Sequelize.BelongsToCreateAssociationMixin<teachers>;

  static initModel(sequelize: Sequelize.Sequelize): typeof teacher_has_group {
    return teacher_has_group.init({
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id'
      }
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'teacher_has_group',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "teacher_has_group_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
