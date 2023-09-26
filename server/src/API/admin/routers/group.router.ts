import { Router } from 'express';
import { AuthMiddleware } from '../../../middlewares/auth-middleware';
import { GroupController } from '../controllers/group.controller';


const groupRouter = Router();

groupRouter
    .delete('/delete', AuthMiddleware, GroupController.delete)
    .post('/create_or_update', AuthMiddleware, GroupController.createOrUpdate)
    .get('/get_all', AuthMiddleware, GroupController.getAll);

export { groupRouter };