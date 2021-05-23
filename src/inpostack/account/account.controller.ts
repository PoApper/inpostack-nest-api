import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountCreateDto, AccountUpdateDto } from "./account.dto";
import { AccountStatus, AccountType } from "./account.meta";
import { AuthGuard } from "@nestjs/passport";
import { AccountTypes } from "../../auth/role.decorator";
import { AccountTypeGuard } from "../../auth/role.guard";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {
  }

  @Post()
  post(@Body() dto: AccountCreateDto) {
    return this.accountService.save(dto);
  }

  @Get()
  get() {
    return this.accountService.find({ order: { created_at: "DESC" } });
  }

  /**
   * Account Meta-data API
   */
  @Get("meta")
  getAccountMeta() {
    return {
      "AccountType": AccountType,
      "AccountStatus": AccountStatus
    };
  }

  @Get(":uuid")
  getOne(@Param("uuid") uuid: string) {
    return this.accountService.findOne({ uuid: uuid });
  }

  @Put(":uuid")
  put(@Param("uuid") uuid: string, @Body() dto: AccountUpdateDto) {
    return this.accountService.update({ uuid: uuid }, dto);
  }

  @Delete(":uuid")
  delete(@Param("uuid") uuid: string) {
    return this.accountService.delete({ uuid: uuid });
  }


}
