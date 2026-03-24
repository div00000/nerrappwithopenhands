import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.name'),
  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  synchronize: configService.get('nodeEnv') === 'development',
  logging: configService.get('nodeEnv') === 'development',
  ssl: configService.get('nodeEnv') === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    connectionLimit: 10,
  },
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
