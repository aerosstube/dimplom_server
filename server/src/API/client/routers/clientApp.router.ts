import { Router } from 'express';
import { ClientAppController } from '../controllers/clientApp.controller';


const clientAppRouter: Router = Router();

clientAppRouter
    .get('*', ClientAppController.getReactApp);

export { clientAppRouter };
