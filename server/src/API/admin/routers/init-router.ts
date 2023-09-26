import { Router } from 'express';
import { scheduleRouter } from './schedule.router';
import { userRouter } from './user.router';
import { audienceRouter } from './audience.router';
import { groupRouter } from './group.router';
import { lessonRouter } from './lesson.router';


const adminRouterApp: Router = Router();

adminRouterApp
    .use('/schedule', scheduleRouter)
    .use('/user', userRouter)
    .use('/audience', audienceRouter)
    .use('/group', groupRouter)
    .use('/lesson', lessonRouter);

export { adminRouterApp };
