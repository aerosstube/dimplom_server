import { Router } from 'express';
import { AuthMiddleware } from '../../../middlewares/auth-middleware';
import { AudienceController } from '../controllers/audience.controller';


const audienceRouter = Router();

audienceRouter
    .delete('/delete', AuthMiddleware, AudienceController.delete)
    .post('/create_or_update', AuthMiddleware, AudienceController.createOrUpdate)
    .get('/get_all', AuthMiddleware, AudienceController.getAll);

export { audienceRouter };