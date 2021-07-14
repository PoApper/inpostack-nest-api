import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from "../inpostack/account/account.module";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { MailModule } from "../mail/mail.module";
import { StoreModule } from '../inpostack/store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AccountModule,
    StoreModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRETE_KEY,
      signOptions: {expiresIn: '360000s'}
    }),
    MailModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
