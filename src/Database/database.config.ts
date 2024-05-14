import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { User, Vacancy, Technology, Company } from './entities';
import { Vacancies_Technologies } from './entities/technology_vacancy.entity';

export default <TypeOrmModuleAsyncOptions>{
  inject: [ConfigService],

  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return <PostgresConnectionOptions>{
      type: 'postgres',
      host: configService.get('DB_HOST' || 'PGHOST'),
      port: +configService.get('DB_PORT' || 'PGPORT'),
      username: configService.get('DB_USERNAME' || 'POSTGRES_USER'),
      password: configService.get('DB_PASSWORD' || 'POSTGRES_PASSWORD'),
      database: configService.get('DB_NAME' || 'PGDATABASE'),
      entities: [User, Vacancy, Technology, Company],
      synchronize: true,
      logging: true,
    };
  },
};
