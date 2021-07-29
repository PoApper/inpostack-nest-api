import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AccountService } from '../inpostack/account/account.service';
import { AccountStatus, AccountType } from '../inpostack/account/account.meta';
import { AccountCreateDto } from '../inpostack/account/account.dto';
import { StoreService } from '../inpostack/store/store.service';
import { AccountTypeGuard } from './role.guard';
import { AccountTypes } from './role.decorator';
import { StoreDto } from '../inpostack/store/store.dto';

/**
 * This is for handle "verifyToken", "login", "logout" tasks
 */

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly accountService: AccountService,
    private readonly storeService: StoreService,
    private readonly mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  // TODO: will be deprecated
  @Get('verifyToken')
  @UseGuards(AuthGuard('jwt'))
  async verifyToken(@Req() req: Request) {
    const user: any = req.user;

    if (user.account_type == AccountType.storeOwner) {
      user.store = await this.storeService.findOne({ owner_uuid: user.uuid });
    }

    return user;
  }

  /**
   * Return account information
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getAccountInfo(@Req() req: Request) {
    const user: any = req.user;
    return user;
  }

  /**
   * Return store information
   */
  @Get('me/store')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.storeOwner)
  getStoreInfo(@Req() req: Request) {
    const user: any = req.user;
    return this.storeService.findOne({ owner_uuid: user.uuid });
  }

  @Put('me/store')
  @UseGuards(AuthGuard('jwt'), AccountTypeGuard)
  @AccountTypes(AccountType.storeOwner)
  updateStoreInfo(@Req() req: Request, @Body() updateDto: StoreDto) {
    const user: any = req.user;
    return this.storeService.update({ owner_uuid: user.uuid }, updateDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const user: any = req.user;
      const token = this.authService.generateJwtToken(user);
      res.setHeader('Set-Cookie', `Authentication=${token}; HttpOnly; Path=/;`);
      this.accountService.updateLoginById(user.id);
      this.logger.info(`Login Succeed!: uuid=${user.uuid}`);
      return res.send(user);
    } catch (err) {
      this.logger.error(`Failed to login...${err}`);
    }
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Res() res: Response) {
    try {
      res.setHeader(
        'Set-Cookie',
        `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      );
      this.logger.info(`Logout Succeed!`);
      return res.sendStatus(200);
    } catch (err) {
      this.logger.error(`Failed to logout...${err}`);
    }
  }

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '계정 생성 & 인증 메일 발송',
  })
  async register(
    @Body() dto: AccountCreateDto,
    @Query('sendMail') sendMail?: boolean,
  ) {
    let newAccount;
    try {
      newAccount = await this.accountService.save(dto);
      console.log(newAccount);
    } catch (err) {
      this.logger.error(`Failed to register...${err}`);
    }

    if (sendMail) {
      try {
        this.mailService.sendVerificationMail(
          newAccount.email,
          newAccount.uuid,
        );
        this.logger.info('Succeed to send email!');
      } catch (err) {
        this.logger.error(`Failed to send email...${err}`);
      }
    }
    this.logger.info(`Succeed to register: uuid=${newAccount.uuid}`);
    return newAccount;
  }

  @Get('activateAccount/:uuid')
  async activateAccount(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      await this.accountService.findOneOrFail({ uuid: uuid });
      await this.accountService.update(
        { uuid: uuid },
        { account_status: AccountStatus.activated },
      );
      this.logger.info(`Succeed to active account: uuid=${uuid}`);
      res.redirect(process.env.public_web);
    } catch (err) {
      this.logger.error(`Failed to activate account...${err}`);
    }
  }
}
