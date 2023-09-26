import { Transaction } from 'sequelize';
import { Op } from 'sequelize';

import { groups } from '../../../models/groups';
import { schedule } from '../../../models/schedule';
import { teacher_has_classes } from '../../../models/teacher_has_classes';
import { teacher_has_group } from '../../../models/teacher_has_group';
import { two_our_class } from '../../../models/two_our_class';
import { users } from '../../../models/users';
import { ApiError } from '../../errors/api.error';
import { AudienceService } from '../audience-service/audience.service';
import { AuthUser } from '../auth-services/auth.service';
import { GroupDatabaseService } from '../group-services/group.database.service';
import { GroupService } from '../group-services/group.service';
import { StudentService } from '../student-services/student.service';
import { TeacherService } from '../teacher-service/teacher.service';
import { TwoHourClassBusinessService } from '../twoHourClass-services/twoHourClass.business.service';
import { TwoHourClassDatabaseService } from '../twoHourClass-services/twoHourClass.database.service';
import { TwoHourClassService } from '../twoHourClass-services/twoHourClass.service';
import { WeekdayService } from '../weekday-service/weekday.service';
import { ScheduleDatabaseService } from './schedule.database.service';
import { ScheduleService } from './schedule.service';

export interface ScheduleOptions {
	id?: number;
	startTime: string;
	groupId: number;
	classId: number;
	weekdayId: number;
	audienceId: number;
	teacherId: number;
	dateOfClass: string;
	numberOfSchedule: number;
}

export interface ScheduleDay {
	schedules: Schedule[];
}

export interface ScheduleWeek {
	scheduleDays: ScheduleDay[];
}

export interface Schedule {
	startTime: Date;
	groupName: string;
	weekday: string;
	audience: number;
	twoOurClassName: string;
	teacher?: string;
	dateOfClass: Date;
	homework?: string;
	mark?: string;
	lessonTheme: string;
	id: number;
	file?: string;
	numberOfSchedule?: number;
}

export interface ScheduleUserInfo {
	studentIdFK: number;
	groupId: number;
	isTeacher?: boolean;
}

export class ScheduleBusinessService {
	static async getScheduleWeek(
		user: AuthUser,
		startOfWeek: Date
	): Promise<ScheduleWeek> {
		const student = await StudentService.getStudentByUserId(user.userId);
		const scheduleUserInfo: ScheduleUserInfo = {
			studentIdFK: student.id,
			groupId: student.group_id,
		};

		return await ScheduleService.getScheduleWeek(startOfWeek, scheduleUserInfo);
	}

	static async getScheduleWeekMarks(
		user: AuthUser,
		startOfWeek: Date
	): Promise<ScheduleWeek> {
		const student = await StudentService.getStudentByUserId(user.userId);
		if (!student) {
			throw ApiError.AcessDenied();
		}
		const scheduleUserInfo: ScheduleUserInfo = {
			studentIdFK: student.id,
			groupId: student.group_id,
		};

		return await ScheduleService.getScheduleMarks(
			startOfWeek,
			scheduleUserInfo
		);
	}

	static async getScheduleById(id: number): Promise<Schedule> {
		return await ScheduleService.getSchedule(
			await ScheduleService.getScheduleById(id)
		);
	}

	static async create(
		scheduleOptions: ScheduleOptions,
		error: boolean,
		transaction: Transaction
	): Promise<void> {
		const isDuplicate = await this.isDupplicate(
			new Date(scheduleOptions.startTime),
			scheduleOptions.teacherId,
			scheduleOptions.audienceId,
			scheduleOptions.groupId
		);
		console.log(error);

		if (!isDuplicate) {
			await schedule.create(
				{
					start_time: new Date(scheduleOptions.startTime),
					date_of_class: new Date(scheduleOptions.dateOfClass),
					group_id: scheduleOptions.groupId,
					two_our_class_id: scheduleOptions.classId,
					teacher_id: scheduleOptions.teacherId,
					audience_id: scheduleOptions.audienceId,
					weekday_id: scheduleOptions.weekdayId,
					number_of_schedule: scheduleOptions.numberOfSchedule,
				},
				{ transaction }
			);
		} else {
			error = true;
		}
	}

	static async getTeacherSchedule(
		user: AuthUser,
		startOfWeek: Date
	): Promise<ScheduleWeek> {
		const teacher = await TeacherService.getTeacherByUserId(user.userId);
		const groups = await TeacherService.getTeacherGroups(teacher.id);
		const scheduleUserInfo: any = {
			studentIdFK: teacher.id,
			groups: groups,
			isTeacher: true,
		};

		return await ScheduleService.getScheduleWeek(startOfWeek, scheduleUserInfo);
	}

	static async getOptions() {
		return {
			scheduleOptions: {
				groups: await GroupService.getAll(),
				classes: await TwoHourClassService.getAll(),
				teachers: await TeacherService.getAll(),
				audiences: await AudienceService.getAll(),
				weekdays: await WeekdayService.getAll(),
			},
		};
	}

	static async update(
		scheduleOptions: ScheduleOptions,
		errors: number[],
		transaction: Transaction
	) {
		const isDupplicate = await ScheduleDatabaseService.findDuplicate(
			scheduleOptions
		);

		if (!isDupplicate) {
			const schedule = await ScheduleService.getScheduleById(
				scheduleOptions.id
			);

			schedule.group_id = scheduleOptions.groupId;
			schedule.start_time = new Date(scheduleOptions.startTime);
			schedule.date_of_class = new Date(scheduleOptions.dateOfClass);
			schedule.weekday_id = scheduleOptions.weekdayId;
			schedule.audience_id = scheduleOptions.audienceId;
			schedule.two_our_class_id = scheduleOptions.classId;
			schedule.teacher_id = scheduleOptions.teacherId;
			schedule.number_of_schedule = scheduleOptions.numberOfSchedule;
			await schedule.save({ transaction });
		} else {
			errors.push(scheduleOptions.id);
		}
	}

	static async delete(ids: string[], transaction: Transaction) {
		for (const id of ids) {
			await ScheduleService.delete({ where: { id } }, transaction);
		}
	}

	static async getAll(filters?: {
		dateOfClass?: string;
		betweenDates?: string[];
	}): Promise<Schedule[]> {
		const arr = [];
		const includedFilters: any = {};

		if (filters?.dateOfClass) {
			includedFilters.date_of_class = new Date(filters.dateOfClass);
		}

		if (filters?.betweenDates[0] !== 'undefined' && filters?.betweenDates[0]) {
			includedFilters.date_of_class = {
				[Op.between]: [
					new Date(filters.betweenDates[0]),
					new Date(filters.betweenDates[1]),
				],
			};
		}

		const schedules = await ScheduleDatabaseService.findAllBySmth({
			where: includedFilters,
			order: [['start_time', 'DESC']],
		});

		for (const schedule of schedules) {
			arr.push(await ScheduleService.getSchedule(schedule));
		}
		return arr;
	}

	static async isDupplicate(
		startTime: Date,
		teacherId: number,
		audienceId: number,
		groupId: number
	): Promise<boolean> {
		const teacherDuplicates =
			await ScheduleDatabaseService.findTeacherDuplicate(startTime, teacherId);
		const audienceDuplicates =
			await ScheduleDatabaseService.findAudienceDuplicate(
				startTime,
				audienceId
			);
		const groupDuplicates = await ScheduleDatabaseService.findGroupsDuplicate(
			startTime,
			groupId
		);
		return !!teacherDuplicates || !!audienceDuplicates || !!groupDuplicates;
	}

	static async getTeacher(params: { lessonId?: number; groupId?: number }) {
		if (params.lessonId && params.groupId) {
			return await TeacherService.getBySmth({
				attributes: ['id'],
				include: [
					{
						model: teacher_has_group,
						as: `teacher_has_groups`,
						attributes: [],
						where: { group_id: params.groupId },
					},
					{
						model: teacher_has_classes,
						as: 'teacher_has_classes',
						attributes: [],
						where: { two_our_class_id_fk: params.lessonId },
					},
					{
						model: users,
						as: `user`,
						attributes: ['id', 'first_name', 'second_name', 'middle_name'],
						order: [['second_name', 'ASC']],
					},
				],
			});
		}
		if (params.lessonId) {
			return await TeacherService.getBySmth({
				attributes: ['id'],
				include: [
					{
						model: teacher_has_classes,
						as: `teacher_has_classes`,
						where: { two_our_class_id_fk: params.lessonId },
						attributes: [],
					},
					{
						model: users,
						as: `user`,
						attributes: ['id', 'first_name', 'second_name', 'middle_name'],
						order: [['second_name', 'ASC']],
					},
				],
			});
		}

		return await TeacherService.getBySmth({
			attributes: ['id'],
			include: [
				{
					model: teacher_has_group,
					as: `teacher_has_groups`,
					where: { group_id: params.groupId },
					attributes: [],
				},
				{
					model: users,
					as: `user`,
					attributes: ['id', 'first_name', 'second_name', 'middle_name'],
					order: [['second_name', 'ASC']],
				},
			],
		});
	}

	static async getSubjectsAndGroupsByTeacherId(teacherId: number) {
		return [
			(
				await TeacherService.getBySmth({
					where: { id: teacherId },
					attributes: [],
					include: [
						{
							model: teacher_has_classes,
							as: 'teacher_has_classes',
							include: [
								{
									model: two_our_class,
									as: 'two_our_class_id_fk_two_our_class',
								},
							],
							attributes: ['id'],
						},
					],
				})
			)[0],
			(
				await TeacherService.getBySmth({
					where: { id: teacherId },
					attributes: [],
					include: [
						{
							model: teacher_has_group,
							as: 'teacher_has_groups',
							attributes: ['id'],
							include: [
								{
									model: groups,
									as: 'group',
								},
							],
						},
					],
				})
			)[0],
		];
	}
}
