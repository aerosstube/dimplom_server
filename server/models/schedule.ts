import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { audiences, audiencesId } from './audiences';
import type { groups, groupsId } from './groups';
import type { teachers, teachersId } from './teachers';
import type { two_our_class, two_our_classId } from './two_our_class';
import type { weekdays, weekdaysId } from './weekdays';

export interface scheduleAttributes {
  id: number;
  start_time: Date;
  group_id: number;
  weekday_id: number;
  audience_id: number;
  two_our_class_id: number;
  teacher_id: number;
  date_of_class: Date;
  homework?: string;
  lesson_theme?: string;
  file?: string;
  number_of_schedule?: number;
}

export type schedulePk = "id";
export type scheduleId = schedule[schedulePk];
export type scheduleOptionalAttributes = "id" | "homework" | "lesson_theme" | "file" | "number_of_schedule";
export type scheduleCreationAttributes = Optional<scheduleAttributes, scheduleOptionalAttributes>;

export class schedule extends Model<scheduleAttributes, scheduleCreationAttributes> implements scheduleAttributes {
  id!: number;
  start_time!: Date;
  group_id!: number;
  weekday_id!: number;
  audience_id!: number;
  two_our_class_id!: number;
  teacher_id!: number;
  date_of_class!: Date;
  homework?: string;
  lesson_theme?: string;
  file?: string;
  number_of_schedule?: number;

  // schedule belongsTo audiences via audience_id
  audience!: audiences;
  getAudience!: Sequelize.BelongsToGetAssociationMixin<audiences>;
  setAudience!: Sequelize.BelongsToSetAssociationMixin<audiences, audiencesId>;
  createAudience!: Sequelize.BelongsToCreateAssociationMixin<audiences>;
  // schedule belongsTo groups via group_id
  group!: groups;
  getGroup!: Sequelize.BelongsToGetAssociationMixin<groups>;
  setGroup!: Sequelize.BelongsToSetAssociationMixin<groups, groupsId>;
  createGroup!: Sequelize.BelongsToCreateAssociationMixin<groups>;
  // schedule belongsTo teachers via teacher_id
  teacher!: teachers;
  getTeacher!: Sequelize.BelongsToGetAssociationMixin<teachers>;
  setTeacher!: Sequelize.BelongsToSetAssociationMixin<teachers, teachersId>;
  createTeacher!: Sequelize.BelongsToCreateAssociationMixin<teachers>;
  // schedule belongsTo two_our_class via two_our_class_id
  two_our_class!: two_our_class;
  getTwo_our_class!: Sequelize.BelongsToGetAssociationMixin<two_our_class>;
  setTwo_our_class!: Sequelize.BelongsToSetAssociationMixin<two_our_class, two_our_classId>;
  createTwo_our_class!: Sequelize.BelongsToCreateAssociationMixin<two_our_class>;
  // schedule belongsTo weekdays via weekday_id
  weekday!: weekdays;
  getWeekday!: Sequelize.BelongsToGetAssociationMixin<weekdays>;
  setWeekday!: Sequelize.BelongsToSetAssociationMixin<weekdays, weekdaysId>;
  createWeekday!: Sequelize.BelongsToCreateAssociationMixin<weekdays>;

  static initModel(sequelize: Sequelize.Sequelize): typeof schedule {
    return schedule.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    weekday_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'weekdays',
        key: 'id'
      }
    },
    audience_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'audiences',
        key: 'id'
      }
    },
    two_our_class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'two_our_class',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id'
      }
    },
    date_of_class: {
      type: DataTypes.DATE,
      allowNull: false
    },
    homework: {
      type: DataTypes.STRING(4096),
      allowNull: true
    },
    lesson_theme: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    number_of_schedule: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'schedule',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "schedule_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
