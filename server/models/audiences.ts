import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { schedule, scheduleId } from './schedule';

export interface audiencesAttributes {
  id: number;
  number_audience: number;
}

export type audiencesPk = "id";
export type audiencesId = audiences[audiencesPk];
export type audiencesOptionalAttributes = "id";
export type audiencesCreationAttributes = Optional<audiencesAttributes, audiencesOptionalAttributes>;

export class audiences extends Model<audiencesAttributes, audiencesCreationAttributes> implements audiencesAttributes {
  id!: number;
  number_audience!: number;

  // audiences hasMany schedule via audience_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof audiences {
    return audiences.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: "audiences_id_key"
    },
    number_audience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "audiences_number_audience_key"
    }
  }, {
    sequelize,
    tableName: 'audiences',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "audiences_id_key",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "audiences_number_audience_key",
        unique: true,
        fields: [
          { name: "number_audience" },
        ]
      },
      {
        name: "audiences_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
