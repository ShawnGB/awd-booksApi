import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'postgres');
        const isTest = configService.get('NODE_ENV') === 'test';

        // Use SQLite for testing
        if (dbType === 'sqlite' || isTest) {
          return {
            type: 'sqlite',
            database: configService.get('DB_NAME', ':memory:'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }

        // Use PostgreSQL for development/production
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
