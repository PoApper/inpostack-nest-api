import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccountTypeGuard } from './auth/guard/role.guard';
import { AccountTypes } from './auth/decorator/role.decorator';
import { AccountType } from './inpostack/account/account.meta';
import { StoreGuard } from './auth/guard/store.guard';
import { JwtGuard } from './auth/guard/jwt.guard';
import { AllowAnonymous } from './auth/decorator/anonymous.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('anonymous_auth')
  @UseGuards(JwtGuard)
  @AllowAnonymous()
  testAnonymousAuth(@Req() req) {
    return req.user ?? 'Non-login User';
  }

  @Get('private_auth')
  @UseGuards(JwtGuard)
  testPrivateAuth(@Req() req) {
    return req.user;
  }

  @Get('role_auth')
  @UseGuards(JwtGuard, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  testRoleAuth(@Req() req) {
    return req.user;
  }

  @Get('owner_auth')
  @UseGuards(JwtGuard, AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  testStoreAuth(@Req() req) {
    return req.user;
  }
}
