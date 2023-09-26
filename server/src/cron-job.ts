import * as cron from 'node-cron';
import { AuthService } from './services/auth-services/auth.service';


export class CronJob {
    static async startJob() {
        cron.schedule('* * * 31 * *', async () => {
            await AuthService.destroyExpiredTokens();
        });
    }
}