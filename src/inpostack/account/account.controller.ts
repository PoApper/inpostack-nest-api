import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccountService } from "./account.service";
import { AccountCreateDto, AccountUpdateDto } from "./account.dto";
import { AccountStatus, AccountType } from "./account.meta";
import { AuthGuard } from "@nestjs/passport";
import { AccountTypes } from "../../auth/role.decorator";
import { AccountTypeGuard } from "../../auth/role.guard";

import {ApiOperation, ApiTags} from "@nestjs/swagger";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@ApiTags("Account")
@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {
  }

  @Post()
  @ApiOperation({summary: "create account API", description: "create a new account"})
  post(@Body() dto: AccountCreateDto) {
    try {
      this.logger.info(`Create new account: user_id=${dto.id}, email=${dto.email}`);
      return this.accountService.save(dto);
    } catch(err) {
      this.logger.error(`Failed to creat account...${err}`);
    }
  }

  @Get()
  @ApiOperation({summary: "get all account API", description: "get whole accounts"})
  get() {
    return this.accountService.find({ order: { created_at: "DESC" } });
  }

  @Get("meta")
  @ApiOperation({summary: 'get account meta API', description: 'get account meta data'})
  getMeta() {
    return {
      "account_type": AccountType,
      "account_status": AccountStatus
    };
  }

  @Get(":uuid")
  @ApiOperation({summary: "get specific account API", description: "get a specific account using uuid"})
  getOne(@Param("uuid") uuid: string) {
    return this.accountService.findOne({ uuid: uuid });
  }

  @Put(":uuid")
  @ApiOperation({summary: "update account API", description: "update a specific account using uuid"})
  put(@Param("uuid") uuid: string, @Body() dto: AccountUpdateDto) {
    try {
      this.logger.info(`Update account: uuid=${uuid}`);
      return this.accountService.update({ uuid: uuid }, dto);
    } catch(err) {
      this.logger.error(`Failed to update account...${err}`);
    }

  }

  @Delete(":uuid")
  @ApiOperation({summary: "delete account API", description: "delete a specific account using uuid"})
  delete(@Param("uuid") uuid: string) {
    try {
      this.logger.info(`Delete account: uuid=${uuid}`);
      return this.accountService.delete({ uuid: uuid });
    } catch(err) {
      this.logger.error(`Failed to delete account...${err}`);
    }
  }
}
