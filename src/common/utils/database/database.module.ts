import { Sequelize } from 'sequelize-typescript';
import { Provides } from 'src/common/resources/common/provides';
import { ConfigService } from '../config/config.service';

export const sequelizeProvider = (models) => ({
  provide: Provides.sequelize,
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize({
      dialect: 'mysql',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
    });
    sequelize.addModels(models);
    return sequelize;
  },
  inject: [ConfigService],
});
