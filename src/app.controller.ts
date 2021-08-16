import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountTypeGuard } from './auth/role/role.guard';
import { AccountTypes } from './auth/role/role.decorator';
import { AccountType } from './inpostack/account/account.meta';
import { StoreGuard } from './auth/guard/store.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('private_auth')
  @UseGuards(AuthGuard('jwt'))
  testPrivateAuth(@Req() req) {
    return req.user;
  }

  @Get('role_auth')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  testRoleAuth(@Req() req) {
    return req.user;
  }

  @Get('owner_auth')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard, StoreGuard)
  @AccountTypes(AccountType.storeOwner)
  testStoreAuth(@Req() req) {
    return req.user;
  }
}
