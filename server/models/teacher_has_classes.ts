import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { teachers, teachersId } from './teachers';
import type { two_our_class, two_our_classId } from './two_our_class';

export interface teacher_has_classesAttributes {
  id: number;
  teacher_id_fk: number;
  two_our_class_id_fk: number;
}

export type teacher_has_classesPk = "id";
export type teacher_has_classesId = teacher_has_classes[teacher_has_classesPk];
export type teacher_has_classesOptionalAttributes = "id";
export type teacher_has_classesCreationAttributes = Optional<teacher_has_classesAttributes, teacher_has_classesOptionalAttributes>;

export class teacher_has_classes extends Model<teacher_has_classesAttributes, teacher_has_classesCreationAttributes> implements teacher_has_classesAttributes {
  id!: number;
  teacher_id_fk!: number;
  two_our_class_id_fk!: number;

  // teacher_has_classes belongsTo teachers via teacher_id_fk
  teacher_id_fk_teacher!: teachers;
  getTeacher_id_fk_teacher!: Sequelize.BelongsToGetAssociationMixin<teachers>;
  setTeacher_id_fk_teacher!: Sequelize.BelongsToSetAssociationMixin<teachers, teachersId>;
  createTeacher_id_fk_teacher!: Sequelize.BelongsToCreateAssociationMixin<teachers>;
  // teacher_has_classes belongsTo two_our_class via two_our_class_id_fk
  two_our_class_id_fk_two_our_class!: two_our_class;
  getTwo_our_class_id_fk_two_our_class!: Sequelize.BelongsToGetAssociationMixin<two_our_class>;
  setTwo_our_class_id_fk_two_our_class!: Sequelize.BelongsToSetAssociationMixin<two_our_class, two_our_classId>;
  createTwo_our_class_id_fk_two_our_class!: Sequelize.BelongsToCreateAssociationMixin<two_our_class>;

  static initModel(sequelize: Sequelize.Sequelize): typeof teacher_has_classes {
    return teacher_has_classes.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    teacher_id_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id'
      }
    },
    two_our_class_id_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'two_our_class',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'teacher_has_classes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "teacher_has_classes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
