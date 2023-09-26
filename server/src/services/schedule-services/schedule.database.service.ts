import { Op } from 'sequelize';

import { schedule } from '../../../models/schedule';
import { ScheduleOptions } from './schedule.business.service';

export class ScheduleDatabaseService {
	static async findDuplicate(scheduleOptions: ScheduleOptions) {
		return await schedule.findOne({
			where: {
				[Op.and]: [
					{ audience_id: scheduleOptions.audienceId },
					{ teacher_id: scheduleOptions.teacherId },
					{ start_time: scheduleOptions.startTime },
					{ group_id: scheduleOptions.groupId },
				],
			},
		});
	}

	static async getScheduleWeek(
		date: Date,
		groupId: number,
		userInfo: {
			isTeacher?: boolean;
			userId?: number;
		} = {}
	): Promise<schedule[]> {
		const secDate: Date = new Date(date);
		secDate.setDate(secDate.getDate() + 6);
		if (!userInfo.isTeacher) {
			return await schedule.findAll({
				where: {
					date_of_class: {
						[Op.between]: [date, secDate],
					},
					group_id: {
						[Op.eq]: groupId,
					},
				},
				order: [['start_time', 'ASC']],
			});
		}

		return await schedule.findAll({
			where: {
				date_of_class: {
					[Op.between]: [date, secDate],
				},
				teacher_id: {
					[Op.eq]: userInfo.userId,
				},
			},
			order: [
				// @ts-ignore
				['start_time'],
			],
		});
	}

	static async getDates(groupId: number, classId: number): Promise<schedule[]> {
		return await schedule.findAll({
			where: {
				group_id: groupId,
				two_our_class_id: classId,
			},
			attributes: ['id', `start_time`],
			order: [[`start_time`, `ASC`]],
		});
	}

	static async findScheduleById(id: number): Promise<schedule | null> {
		return schedule.findOne({
			where: {
				id: id,
			},
		});
	}

	static async findTeacherDuplicate(startTime: Date, teacherId: number) {
		return await schedule.findOne({
			where: {
				start_time: startTime,
				teacher_id: teacherId,
			},
		});
	}

	static async findAllBySmth(obj: { where: {}; order?: any }) {
		return await schedule.findAll(obj);
	}

	static async findAudienceDuplicate(startTime: Date, audienceId: number) {
		return await schedule.findOne({
			where: {
				start_time: startTime,
				audience_id: audienceId,
			},
		});
	}

	static async beetwenDate(betweenDates: Date[]) {
		return await schedule.findAll({
			where: {
				date_of_class: {
					[Op.between]: [betweenDates[0], betweenDates[1]],
				},
			},
		});
	}

	static async findGroupsDuplicate(startTime: Date, groupId: number) {
		return await schedule.findOne({
			where: {
				start_time: startTime,
				group_id: groupId,
			},
		});
	}
}
