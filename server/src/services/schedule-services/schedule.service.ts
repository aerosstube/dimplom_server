import { Transaction } from 'sequelize';

import { schedule } from '../../../models/schedule';
import { ApiError } from '../../errors/api.error';
import { AudienceService } from '../audience-service/audience.service';
import { GroupService } from '../group-services/group.service';
import { MarkService } from '../mark-services/mark.service';
import { TeacherService } from '../teacher-service/teacher.service';
import { TwoHourClassService } from '../twoHourClass-services/twoHourClass.service';
import { WeekdayService } from '../weekday-service/weekday.service';
import {
	Schedule,
	ScheduleDay,
	ScheduleUserInfo,
	ScheduleWeek,
} from './schedule.business.service';
import { ScheduleDatabaseService } from './schedule.database.service';

export class ScheduleService {
	static async getSchedule(schedule: schedule): Promise<Schedule> {
		const audience = await AudienceService.getAudience(schedule.audience_id);
		const teacher = await TeacherService.getTeacher(schedule.teacher_id);
		const group = await GroupService.getById(schedule.group_id);
		const twoHourClass = await TwoHourClassService.getTwoHourClass(
			schedule.two_our_class_id
		);
		const weekday = await WeekdayService.getWeekday(schedule.weekday_id);

		return {
			id: schedule.id,
			weekday: weekday.name,
			audience: audience.number_audience,
			dateOfClass: schedule.date_of_class,
			groupName: group.name,
			homework: schedule.homework,
			startTime: schedule.start_time,
			teacher: `${teacher.second_name} ${teacher.first_name} ${
				teacher.middle_name ? teacher.middle_name : ''
			}`,
			twoOurClassName: twoHourClass.name,
			// @ts-ignore
			mark: schedule.mark,
			lessonTheme: schedule.lesson_theme,
			numberOfSchedule: schedule.number_of_schedule,
			file: schedule.file,
		};
	}

	static async getScheduleDay(
		scheduleDayDatabase: schedule[]
	): Promise<ScheduleDay> {
		const scheduleDay: ScheduleDay = {
			schedules: [],
		};

		for (const schedule of scheduleDayDatabase) {
			const temp: Schedule = await this.getSchedule(schedule);
			scheduleDay.schedules.push(temp);
		}

		return scheduleDay;
	}

	static async getScheduleWeek(
		startOfWeek: Date,
		scheduleUserInfo: ScheduleUserInfo
	): Promise<ScheduleWeek> {
		const scheduleWeekDatabase: schedule[] =
			await ScheduleDatabaseService.getScheduleWeek(
				startOfWeek,
				scheduleUserInfo.groupId,
				{
					isTeacher: scheduleUserInfo.isTeacher,
					userId: scheduleUserInfo.studentIdFK,
				}
			);
		if (scheduleWeekDatabase.length === 0)
			throw ApiError.BadRequest('Расписание на эту неделю не существует!');

		const scheduleWeek: ScheduleWeek = {
			scheduleDays: [],
		};

		startOfWeek.setDate(startOfWeek.getDate() - 1);
		for (let i = 0; i < 6; i++) {
			startOfWeek.setDate(startOfWeek.getDate() + 1);

			let scheduleArr: any[] = [];
			for (const schedule of scheduleWeekDatabase) {
				if (
					schedule.date_of_class.toISOString() === startOfWeek.toISOString()
				) {
					scheduleArr.push(schedule);
				}
			}

			scheduleWeek.scheduleDays.push(
				await ScheduleService.getScheduleDay(scheduleArr)
			);
		}

		return scheduleWeek;
	}

	static async getScheduleMarks(
		startOfWeek: Date,
		scheduleUserInfo: ScheduleUserInfo
	): Promise<ScheduleWeek> {
		const scheduleWeekDatabase: schedule[] =
			await ScheduleDatabaseService.getScheduleWeek(
				startOfWeek,
				scheduleUserInfo.groupId
			);
		if (scheduleWeekDatabase.length === 0)
			throw ApiError.BadRequest('Расписание на эту неделю не существует!');
		const marks = await MarkService.getMarks(
			scheduleUserInfo.studentIdFK,
			startOfWeek
		);
		const scheduleWeek: ScheduleWeek = {
			scheduleDays: [],
		};

		startOfWeek.setDate(startOfWeek.getDate() - 1);
		for (let i = 0; i < 6; i++) {
			startOfWeek.setDate(startOfWeek.getDate() + 1);

			let scheduleArr: any[] = [];
			for (const schedule of scheduleWeekDatabase) {
				if (
					schedule.date_of_class.toISOString() === startOfWeek.toISOString()
				) {
					for (const mark of marks) {
						if (
							mark.two_our_class_id === schedule.two_our_class_id &&
							mark.date.toISOString() === schedule.start_time.toISOString()
						) {
							// @ts-ignore
							schedule.mark = mark.mark;
						}
					}
					scheduleArr.push(schedule);
				}
			}

			scheduleWeek.scheduleDays.push(
				await ScheduleService.getScheduleDay(scheduleArr)
			);
		}

		return scheduleWeek;
	}

	static async getScheduleById(id: number): Promise<schedule> {
		const schedule = await ScheduleDatabaseService.findScheduleById(id);
		if (!schedule) {
			throw ApiError.BadRequest('Неверный ID для расписания!');
		}

		return schedule;
	}

	static async delete(
		obj: { where: {} },
		transaction: Transaction
	): Promise<boolean> {
		const schedules = await ScheduleDatabaseService.findAllBySmth(obj);
		for (const schedule of schedules) {
			const date = schedule.start_time;
			const isMarkDeleted = await MarkService.delete(
				{ where: { date: date } },
				transaction
			);
			if (isMarkDeleted) {
				await schedule.destroy({ transaction });
			}
		}
		return true;
	}
}
