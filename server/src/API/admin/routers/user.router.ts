import { Router } from 'express';

import { AuthMiddleware } from '../../../middlewares/auth-middleware';
import { UserController } from '../controllers/user.controller';

const userRouter: Router = Router();
userRouter
	.post(
		'/registration',
		AuthMiddleware,
		UserController.userRegistrationOrUpdate
	)
	.get('/getOptions', AuthMiddleware, UserController.getOptions)
	.get('/getAll', AuthMiddleware, UserController.getAll)
	.get('/checkLogin', AuthMiddleware, UserController.checkLogin)
	.get('/checkPhone', AuthMiddleware, UserController.checkPhone)
	.delete('/delete', AuthMiddleware, UserController.delete);

export { userRouter };
