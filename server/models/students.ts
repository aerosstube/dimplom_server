import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { groups, groupsId } from './groups';
import type { marks, marksId } from './marks';
import type { users, usersId } from './users';

export interface studentsAttributes {
  id: number;
  user_id: number;
  group_id: number;
  is_expelled?: boolean;
}

export type studentsPk = "id";
export type studentsId = students[studentsPk];
export type studentsOptionalAttributes = "id" | "is_expelled";
export type studentsCreationAttributes = Optional<studentsAttributes, studentsOptionalAttributes>;

export class students extends Model<studentsAttributes, studentsCreationAttributes> implements studentsAttributes {
  id!: number;
  user_id!: number;
  group_id!: number;
  is_expelled?: boolean;

  // students belongsTo groups via group_id
  group!: groups;
  getGroup!: Sequelize.BelongsToGetAssociationMixin<groups>;
  setGroup!: Sequelize.BelongsToSetAssociationMixin<groups, groupsId>;
  createGroup!: Sequelize.BelongsToCreateAssociationMixin<groups>;
  // students hasMany marks via student_id
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
  // students belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof students {
    return students.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    is_expelled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'students',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "student_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
