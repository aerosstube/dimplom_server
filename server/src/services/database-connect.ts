import { Dialect, Sequelize } from 'sequelize';
import { database } from '../../config/config';

export const SequelizeConnect = new Sequelize(
	database.name,
	database.user,
	database.password,
	{
		host: database.host,
		dialect: database.dialect as Dialect,
		port: database.port,
		logging: false,
		dialectOptions: {
			useUTC: false,
			timezone: '+03:00',
		},
		timezone: '+03:00',
	}
);
