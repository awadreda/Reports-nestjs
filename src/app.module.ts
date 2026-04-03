import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),

    TypeOrmModule.forRootAsync({
      inject:[ConfigService ],
      useFactory:(config:ConfigService) =>{
          return{
            type:'better-sqlite3',
            database:config.get<string>('DB_NAME'),
            synchronize:true,
            entities:[User,Report]
          }
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: 'better-sqlite3',
    //   database: 'db.sqlite',
    //   entities: [User,Report],

    //   synchronize: true,
    // }),
    ReportsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
