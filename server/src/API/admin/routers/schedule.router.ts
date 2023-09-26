import { Router } from 'express';

import { AuthMiddleware } from '../../../middlewares/auth-middleware';
import { ScheduleController } from '../controllers/schedule.controller';

const scheduleRouter: Router = Router();

scheduleRouter
	.get('/getAll', AuthMiddleware, ScheduleController.getAll)
	.post('/create', AuthMiddleware, ScheduleController.createOrUpdate)
	.delete('/delete', AuthMiddleware, ScheduleController.delete)
	// .get('/isDuplicate', AuthMiddleware, ScheduleController.isDuplicate)
	.get('/get_teacher', AuthMiddleware, ScheduleController.getTeacher)
	.get(
		'/get_subjects_and_groups',
		AuthMiddleware,
		ScheduleController.getSubjectsAndGroups
	)
	.get('/getOptions', AuthMiddleware, ScheduleController.getOptions);

export { scheduleRouter };
