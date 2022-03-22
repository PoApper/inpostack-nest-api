import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountCreateDto, AccountUpdateDto } from './account.dto';
import { AccountStatus, AccountType } from './account.meta';
import { AccountTypes } from '../../auth/decorator/role.decorator';
import { AccountTypeGuard } from '../../auth/guard/role.guard';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InPoStackAuth } from '../../auth/guard/InPoStackAuth.guard';
import { Public } from 'nest-keycloak-connect';

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
  @UseGuards(InPoStackAuth, AccountTypeGuard)
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
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  get(@Query('take') take: number) {
    const findOptions = { order: { last_login_at: 'DESC' } };
    if (take) {
      Object.assign(findOptions, { take: take });
    }
    return this.accountService.find(findOptions);
  }

  @Get('me')
  @ApiOperation({
    summary: 'get account API with auth token',
    description: 'get my account information using auth token',
  })
  @UseGuards(InPoStackAuth)
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
  @Public()
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
  @UseGuards(InPoStackAuth)
  getOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    // TODO: need to hide password!
    return this.accountService.findOne({ uuid: uuid });
  }

  @Put(':uuid')
  @ApiOperation({
    summary: 'update specific account API',
    description: '(only for admin) update a specific account using uuid',
  })
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  updateByAdmin(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: AccountUpdateDto,
  ) {
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
  @UseGuards(InPoStackAuth)
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
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    try {
      this.logger.info(`Delete account: uuid=${uuid}`);
      return this.accountService.delete({ uuid: uuid });
    } catch (err) {
      this.logger.error(`Failed to delete account...${err}`);
    }
  }
}
