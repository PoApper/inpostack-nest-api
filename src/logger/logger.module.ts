import { Module } from "@nestjs/common";
import * as winston from "winston";
import * as winstonDaily from "winston-daily-rotate-file";
import { WinstonModule } from "nest-winston";

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.colorize(),
            winston.format.printf(
              info => `${info.timestamp} [${info.level}]: ${info.message}`
            ),
            // nestWinstonModuleUtilities.format.nestLike(),
          )
        }),
        new winstonDaily({
          level: "info",
          dirname: "log",
          filename: "%DATE%.log",
          maxFiles: "7d",
          format: winston.format.combine(
            winston.format.timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.printf(
              info => `${info.timestamp} [${info.level}]: ${info.message}`
            ),
          )
        }),
        new winstonDaily({
          level: "error",
          dirname: "log/error",
          filename: "%DATE%.log",
          maxFiles: "7d",
          format: winston.format.combine(
            winston.format.timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.printf(
              info => `${info.timestamp} [${info.level}]: ${info.message}`
            ),
          )
        })
      ]
    })
  ]
})
export class LoggerModule {}
