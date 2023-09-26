import { Op, Transaction } from 'sequelize';
import { user_devices } from '../../../models/init-models';
import { token } from '../../../models/token';
import { SaveTokens } from './auth.business.service';


export interface DeviceInfo {
    userAgent: string;
    deviceIp?: string;
}

export class AuthDatabaseService {

    static async createToken(saveToken: SaveTokens, transaction: Transaction, user_device_id: number): Promise<token> {
        return await token.create({
            user_id: saveToken.userId,
            refresh_token: saveToken.refreshToken,
            date_expired: saveToken.dateExpired,
            user_device_id: user_device_id,
        }, {
            transaction,
        });
    }

    static async createUserDevice(deviceInfo: {
        device_ip: string;
        user_agent: string
    }, transaction: Transaction): Promise<user_devices> {
        return await user_devices.create({
            device_ip: deviceInfo.device_ip,
            user_agent: deviceInfo.user_agent,
        }, { transaction });
    }


    static async findTokenByDeviceId(deviceId: number): Promise<token | null> {
        return await token.findOne({
            where: {
                user_device_id: deviceId,
            },
        });
    }


    static async findToken(refreshToken: string): Promise<token | null> {
        return await token.findOne({
            where: {
                refresh_token: refreshToken,
            },
        });
    }

    static async findUserDeviceByUA(deviceInfo: DeviceInfo): Promise<user_devices | null> {
        return await user_devices.findOne({
            where: {
                device_ip: deviceInfo.deviceIp,
                user_agent: deviceInfo.userAgent,
            },
        });
    }

    static async findExpiredTokens(dateExpired: Date): Promise<token[] | null> {
        return await token.findAll({
            where: {
                date_expired: {
                    [Op.lt]: dateExpired,
                },
            },
        });
    }

    static async findDeviceById(user_device_id: number): Promise<user_devices | null> {
        return await user_devices.findOne({
            where: {
                id: user_device_id,
            },
        });
    }
}