import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect';
import { CsvModule } from 'nest-csv-parser';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InpostackModule } from './inpostack/inpostack.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { LoggerModule } from './logger/logger.module';
import { AccountModule } from './inpostack/account/account.module';
import { StoreModule } from './inpostack/market/store/store.module';
import { StatisticsModule } from './statistics/statistics.module';
import { MenuModule } from './inpostack/market/menu/menu.module';
import { CategoryModule } from './inpostack/market/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    KeycloakConnectModule.register({
      authServerUrl: process.env.SSO_URL,
      realm: process.env.SSO_REALM,
      clientId: process.env.SSO_CLIENT,
      secret: process.env.SSO_SECRET,
      // optional if you want to retrieve JWT from cookie
      cookieKey: 'Authentication',
      logLevels: ['warn'],
    }),
    InpostackModule,
    AccountModule,
    StoreModule,
    CategoryModule,
    MenuModule,
    AuthModule,
    MailModule,
    LoggerModule,
    StatisticsModule,
    CsvModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
