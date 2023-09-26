import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { ApiError } from '../../../errors/api.error';
import { AuthBusinessService, AuthOptions } from '../../../services/auth-services/auth.business.service';
import { JwtTokens } from '../../../services/auth-services/auth.service';
import { SequelizeConnect } from '../../../services/database-connect';


export class AuthController {
    static async userLogin(req: Request, res: Response, next: NextFunction) {
        const transaction: Transaction = await SequelizeConnect.transaction();
        try {
            const { body: { user }, useragent, headers, socket, cookies: { refreshToken } } = req;

            if (refreshToken)
                return next(ApiError.BadRequest('Вы авторизованы!'));

            const deviceIp: string = (headers['x-forwarded-for']) ? (headers['x-forwarded-for']).toString() : socket.remoteAddress;

            const authOptions: AuthOptions = {
                deviceIp: deviceIp,
                userAgent: JSON.stringify(useragent).toString(),
                password: user.password,
                login: user.login,
                role: user.role,
            };

            const tokens: JwtTokens = await AuthBusinessService.userLogin(authOptions, transaction);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 3600 * 1000, httpOnly: true });

            res.json({
                tokens: tokens,
            });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    }


    static async userLogout(req: Request, res: Response, next: NextFunction) {
        const transaction = await SequelizeConnect.transaction();
        try {
            const { cookies } = req;

            await AuthBusinessService.userLogout(cookies.refreshToken, transaction);
            res.clearCookie('refreshToken');
            await transaction.commit();
            res.json('Все удалено!');
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    }

    static async userRefresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { cookies } = req;

            if (!cookies.refreshToken)
                return next(ApiError.BadRequest('Неверный refreshToken'));

            const tokens: JwtTokens = await AuthBusinessService.userRefreshToken(cookies.refreshToken);
            res.json({
                tokens: tokens,
            });
        } catch (err) {
            next(err);
        }
    }
}