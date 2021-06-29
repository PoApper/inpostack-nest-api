import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InpostackModule } from "./inpostack/inpostack.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "./mail/mail.module";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    InpostackModule,
    AuthModule,
    MailModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.colorize(),
            winston.format.printf(
              info => `${info.timestamp} [${info.level}]: ${info.message}`
            ),
            // nestWinstonModuleUtilities.format.nestLike(),
          )
        }),
        new winstonDaily({
          level: 'info',
          dirname: 'log',
          filename: '%DATE%.log',
          maxFiles: '7d',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              info => `${info.timestamp} [${info.level}]: ${info.message}`
            ),
          )
        }),
        new winstonDaily({
          level: 'error',
          dirname: 'log/error',
          filename: '%DATE%.log',
          maxFiles: '7d',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              info => `${info.timestamp} [${info.level}]: ${info.message}`
            ),
          )
        })
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
