import { NextFunction, Request, Response } from 'express';
import path from 'path';


export class ClientAppController {
    static async getReactApp(req: Request, res: Response, next: NextFunction) {
        try {
            res.sendFile(path.join(__dirname, '../../public/app', 'index.html'));
        } catch (err) {
            next(err);
        }
    }
}
