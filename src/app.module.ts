import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InpostackModule } from "./inpostack/inpostack.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "./mail/mail.module";
import { LoggerModule } from "./logger/logger.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    InpostackModule,
    AuthModule,
    MailModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
