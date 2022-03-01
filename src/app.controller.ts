import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';

import { AppService } from './app.service';
import { AccountTypeGuard } from './auth/guard/role.guard';
import { AccountTypes } from './auth/decorator/role.decorator';
import { AccountType } from './inpostack/account/account.meta';
import { StoreGuard } from './auth/guard/store.guard';
import { InPoStackAuth } from './auth/guard/InPoStackAuth.guard';
import { AllowAnonymous } from './auth/decorator/anonymous.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { createQueryBuilder } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('anonymous_auth')
  @UseGuards(InPoStackAuth)
  @AllowAnonymous()
  testAnonymousAuth(@Req() req) {
    return req.user ?? 'Non-login User';
  }

  @Get('private_auth')
  @UseGuards(InPoStackAuth)
  testPrivateAuth(@Req() req) {
    return req.user;
  }

  @Get('role_auth')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  testRoleAuth(@Req() req) {
    return req.user;
  }

  @Get('owner_auth')
  @UseGuards(InPoStackAuth, AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  testStoreAuth(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'InPoStack Overview' })
  @Public()
  @Get('overview')
  async getOverview() {
    const account_count = await createQueryBuilder('account')
      .select('COUNT(*) AS account_count')
      .getRawOne();
    const store_count = await createQueryBuilder('store')
      .select('COUNT(*) AS store_count')
      .getRawOne();
    const notice_count = await createQueryBuilder('notice')
      .select('COUNT(*) AS notice_count')
      .getRawOne();
    const review_count = await createQueryBuilder('review')
      .select('COUNT(*) AS review_count')
      .getRawOne();

    return {
      ...account_count,
      ...store_count,
      ...notice_count,
      ...review_count,
    };
  }
}
