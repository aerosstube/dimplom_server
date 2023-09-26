import { MarkDatabaseService } from '../mark-services/mark.database.service';
import { StudentService } from './student.service';

export class StudentBusinessService {
	static async getAllMarks(userId: number) {
		const student = await StudentService.getStudentByUserId(userId);
		const marks = await StudentService.getAllMarks(student.id);
		for (const mark of marks) {
			let avgMark = 0;
			let n = 0;
			for (let i = 0; i < mark.marks.length; i++) {
				if (!isNaN(parseInt(mark.marks[i].mark))) {
					avgMark += parseInt(mark.marks[i].mark);
					n += 1;
				}
			}

			if (n > 0) {
				// @ts-ignore
				mark.dataValues.avgMark = (avgMark / n).toFixed(2);
			} else {
				// @ts-ignore
				mark.dataValues.avgMark = '';
			}
		}
		return marks;
	}

	static async getAllMisses(userId: number) {
		const misses = await StudentService.getAllMisses(userId);
		const missesOptions = Object.assign(misses);
		const amountMisses = { pSum: 0, bSum: 0, nSum: 0 };
		for (const miss of missesOptions) {
			(miss.dataValues.pSum = 0),
				(miss.dataValues.nSum = 0),
				(miss.dataValues.bSum = 0);
			miss.dataValues.marks.map((mark) => {
				switch (mark.mark) {
					case 'Н':
						miss.dataValues.nSum += 1;
						break;
					case 'П':
						miss.dataValues.pSum += 1;
						break;
					case 'Б':
						miss.dataValues.bSum += 1;
						break;
				}
			});
		}
		missesOptions.map((miss) => {
			amountMisses.pSum += miss.dataValues.pSum;
			amountMisses.nSum += miss.dataValues.nSum;
			amountMisses.bSum += miss.dataValues.bSum;
		});
		return { missesOptions, amountMisses };
	}
}
