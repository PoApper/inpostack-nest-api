import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountCreateDto, AccountUpdateDto } from './account.dto';
import { AccountStatus, AccountType } from './account.meta';
import { AuthGuard } from '@nestjs/passport';
import { AccountTypes } from '../../auth/decorator/role.decorator';
import { AccountTypeGuard } from '../../auth/guard/role.guard';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'create account API',
    description: '(only for admin) create a new account',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  post(@Body() dto: AccountCreateDto) {
    try {
      this.logger.info(`Create new account: email=${dto.email}`);
      return this.accountService.save(dto);
    } catch (err) {
      this.logger.error(`Failed to creat account...${err}`);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'get all accounts API',
    description: '(only for admin) get whole accounts',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  get() {
    return this.accountService.find({ order: { created_at: 'DESC' } });
  }

  @Get('me')
  @ApiOperation({
    summary: 'get account API with auth token',
    description: 'get my account information using auth token',
  })
  @UseGuards(AuthGuard('jwt'))
  getOwnAccount(@Req() req) {
    const user = req.user;
    // TODO: need to hide password!
    return this.accountService.findOne({ uuid: user.uuid });
  }

  @Get('meta')
  @ApiOperation({
    summary: 'get account meta API',
    description: 'get account meta data',
  })
  getMeta() {
    return {
      account_type: AccountType,
      account_status: AccountStatus,
    };
  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'get account API',
    description: 'get a specific account using uuid',
  })
  getOne(@Param('uuid') uuid: string) {
    // TODO: need to hide password!
    return this.accountService.findOne({ uuid: uuid });
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update specific account API',
    description: '(only for admin) update a specific account using uuid',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  updateByAdmin(@Param('uuid') uuid: string, @Body() dto: AccountUpdateDto) {
    try {
      this.logger.info(`Update account: uuid=${uuid}`);
      return this.accountService.update({ uuid: uuid }, dto);
    } catch (err) {
      this.logger.error(`Failed to update account...${err}`);
    }
  }

  @Put('me')
  @ApiOperation({
    summary: 'update own account API',
    description: 'update own account using auth token',
  })
  @UseGuards(AuthGuard('jwt'))
  updateOwnAccount(@Req() req, @Body() dto: AccountUpdateDto) {
    const user = req.user;
    try {
      this.logger.info(`Update account: uuid=${user.uuid}`);
      return this.accountService.update({ uuid: user.uuid }, dto);
    } catch (err) {
      this.logger.error(`Failed to update account...${err}`);
    }
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'delete account API',
    description: '(only for admin) delete a specific account using uuid',
  })
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  delete(@Param('uuid') uuid: string) {
    try {
      this.logger.info(`Delete account: uuid=${uuid}`);
      return this.accountService.delete({ uuid: uuid });
    } catch (err) {
      this.logger.error(`Failed to delete account...${err}`);
    }
  }
}
