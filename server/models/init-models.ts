import type { Sequelize } from "sequelize";
import { audiences as _audiences } from "./audiences";
import type { audiencesAttributes, audiencesCreationAttributes } from "./audiences";
import { groups as _groups } from "./groups";
import type { groupsAttributes, groupsCreationAttributes } from "./groups";
import { marks as _marks } from "./marks";
import type { marksAttributes, marksCreationAttributes } from "./marks";
import { schedule as _schedule } from "./schedule";
import type { scheduleAttributes, scheduleCreationAttributes } from "./schedule";
import { students as _students } from "./students";
import type { studentsAttributes, studentsCreationAttributes } from "./students";
import { teacher_has_classes as _teacher_has_classes } from "./teacher_has_classes";
import type { teacher_has_classesAttributes, teacher_has_classesCreationAttributes } from "./teacher_has_classes";
import { teacher_has_group as _teacher_has_group } from "./teacher_has_group";
import type { teacher_has_groupAttributes, teacher_has_groupCreationAttributes } from "./teacher_has_group";
import { teachers as _teachers } from "./teachers";
import type { teachersAttributes, teachersCreationAttributes } from "./teachers";
import { token as _token } from "./token";
import type { tokenAttributes, tokenCreationAttributes } from "./token";
import { two_our_class as _two_our_class } from "./two_our_class";
import type { two_our_classAttributes, two_our_classCreationAttributes } from "./two_our_class";
import { user_devices as _user_devices } from "./user_devices";
import type { user_devicesAttributes, user_devicesCreationAttributes } from "./user_devices";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";
import { weekdays as _weekdays } from "./weekdays";
import type { weekdaysAttributes, weekdaysCreationAttributes } from "./weekdays";

export {
  _audiences as audiences,
  _groups as groups,
  _marks as marks,
  _schedule as schedule,
  _students as students,
  _teacher_has_classes as teacher_has_classes,
  _teacher_has_group as teacher_has_group,
  _teachers as teachers,
  _token as token,
  _two_our_class as two_our_class,
  _user_devices as user_devices,
  _users as users,
  _weekdays as weekdays,
};

export type {
  audiencesAttributes,
  audiencesCreationAttributes,
  groupsAttributes,
  groupsCreationAttributes,
  marksAttributes,
  marksCreationAttributes,
  scheduleAttributes,
  scheduleCreationAttributes,
  studentsAttributes,
  studentsCreationAttributes,
  teacher_has_classesAttributes,
  teacher_has_classesCreationAttributes,
  teacher_has_groupAttributes,
  teacher_has_groupCreationAttributes,
  teachersAttributes,
  teachersCreationAttributes,
  tokenAttributes,
  tokenCreationAttributes,
  two_our_classAttributes,
  two_our_classCreationAttributes,
  user_devicesAttributes,
  user_devicesCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
  weekdaysAttributes,
  weekdaysCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const audiences = _audiences.initModel(sequelize);
  const groups = _groups.initModel(sequelize);
  const marks = _marks.initModel(sequelize);
  const schedule = _schedule.initModel(sequelize);
  const students = _students.initModel(sequelize);
  const teacher_has_classes = _teacher_has_classes.initModel(sequelize);
  const teacher_has_group = _teacher_has_group.initModel(sequelize);
  const teachers = _teachers.initModel(sequelize);
  const token = _token.initModel(sequelize);
  const two_our_class = _two_our_class.initModel(sequelize);
  const user_devices = _user_devices.initModel(sequelize);
  const users = _users.initModel(sequelize);
  const weekdays = _weekdays.initModel(sequelize);

  schedule.belongsTo(audiences, { as: "audience", foreignKey: "audience_id"});
  audiences.hasMany(schedule, { as: "schedules", foreignKey: "audience_id"});
  schedule.belongsTo(groups, { as: "group", foreignKey: "group_id"});
  groups.hasMany(schedule, { as: "schedules", foreignKey: "group_id"});
  students.belongsTo(groups, { as: "group", foreignKey: "group_id"});
  groups.hasMany(students, { as: "students", foreignKey: "group_id"});
  teacher_has_group.belongsTo(groups, { as: "group", foreignKey: "group_id"});
  groups.hasMany(teacher_has_group, { as: "teacher_has_groups", foreignKey: "group_id"});
  marks.belongsTo(students, { as: "student", foreignKey: "student_id"});
  students.hasMany(marks, { as: "marks", foreignKey: "student_id"});
  schedule.belongsTo(teachers, { as: "teacher", foreignKey: "teacher_id"});
  teachers.hasMany(schedule, { as: "schedules", foreignKey: "teacher_id"});
  teacher_has_classes.belongsTo(teachers, { as: "teacher_id_fk_teacher", foreignKey: "teacher_id_fk"});
  teachers.hasMany(teacher_has_classes, { as: "teacher_has_classes", foreignKey: "teacher_id_fk"});
  teacher_has_group.belongsTo(teachers, { as: "teacher", foreignKey: "teacher_id"});
  teachers.hasMany(teacher_has_group, { as: "teacher_has_groups", foreignKey: "teacher_id"});
  marks.belongsTo(two_our_class, { as: "two_our_class", foreignKey: "two_our_class_id"});
  two_our_class.hasMany(marks, { as: "marks", foreignKey: "two_our_class_id"});
  schedule.belongsTo(two_our_class, { as: "two_our_class", foreignKey: "two_our_class_id"});
  two_our_class.hasMany(schedule, { as: "schedules", foreignKey: "two_our_class_id"});
  teacher_has_classes.belongsTo(two_our_class, { as: "two_our_class_id_fk_two_our_class", foreignKey: "two_our_class_id_fk"});
  two_our_class.hasMany(teacher_has_classes, { as: "teacher_has_classes", foreignKey: "two_our_class_id_fk"});
  students.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(students, { as: "students", foreignKey: "user_id"});
  teachers.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(teachers, { as: "teacher", foreignKey: "user_id"});
  token.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(token, { as: "tokens", foreignKey: "user_id"});
  schedule.belongsTo(weekdays, { as: "weekday", foreignKey: "weekday_id"});
  weekdays.hasMany(schedule, { as: "schedules", foreignKey: "weekday_id"});

  return {
    audiences: audiences,
    groups: groups,
    marks: marks,
    schedule: schedule,
    students: students,
    teacher_has_classes: teacher_has_classes,
    teacher_has_group: teacher_has_group,
    teachers: teachers,
    token: token,
    two_our_class: two_our_class,
    user_devices: user_devices,
    users: users,
    weekdays: weekdays,
  };
}
