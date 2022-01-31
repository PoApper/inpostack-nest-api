import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InPoStackAuth } from './guard/InPoStackAuth.guard';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Public } from 'nest-keycloak-connect';
import { parseToken } from 'nest-keycloak-connect/util';

import { AccountService } from '../inpostack/account/account.service';
import { AllowAnonymous } from './decorator/anonymous.decorator';
import { RefreshTokenDto } from './auth.dto';

/**
 * This is for handle "verifyToken", "login", "logout" tasks
 */

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly accountService: AccountService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  // register after PoApper SSO login
  @Post('register')
  async register(@Req() req) {
    const user = req.user;
    const existUser = await this.accountService.findOne({
      keycloak_id: user.sub,
    });
    if (existUser) {
      throw new BadRequestException('Already Registered User');
    }
    return await this.accountService.save({
      keycloak_id: user.sub,
      email: user.email,
      name: user.name,
    });
  }

  @Get('login')
  @Public()
  login(
    @Res() res,
    @Query('redirect') redirect: string,
    @Query('login_type') login_type: string,
  ) {
    // Redirect to SSO
    let url: string;

    url =
      process.env.SSO_BASE_END +
      '/auth?response_type=code' +
      `&client_id=${process.env.SSO_CLIENT}` +
      `&redirect_uri=${process.env.SSO_REDIRECT}`;

    if (redirect) url += `?redirect=${redirect}`;
    if (login_type) url += `?login_type=${login_type}`;

    res.redirect(url);
  }

  @Get('callback')
  @Public()
  async loginCallback(
    @Req() req,
    @Res() res,
    @Query('redirect') redirect: string,
    @Query('login_type') login_type: string,
    @Query('session_state') session_state: string,
    @Query('code') code: string,
  ) {
    const jwts = await this.authService.getToken(
      session_state,
      code,
      redirect,
      login_type,
    ); // { access_token: 'xxxx', refresh_token: 'xxxx', session_state: 'xxxx', scope: 'xxxx' }

    if (login_type == 'token') {
      // Return the JWT token in the comment_body
      // return res.status(HttpStatus.OK).json(jwts);
      return res.render('login', { token: JSON.stringify(jwts) });
    } else {
      // Default to returning cookies
      res.cookie('Authentication', jwts.access_token, { httpOnly: true });
      res.cookie('Refresh', jwts.refresh_token, { httpOnly: true });

      // Find keycloak user exist in DB, if not redirect to InPoStack register process
      const keycloak_user: any = parseToken(jwts.access_token);
      const existUser = await this.accountService.findOne({
        keycloak_id: keycloak_user.sub,
      });

      if (existUser) {
        if (redirect) res.redirect(redirect);
        else res.redirect(process.env.SSO_CALLBACK_DEFAULT);
        this.authService.saveUserLoginEvent(existUser.uuid);
      } else {
        res.redirect(`${process.env.SSO_CALLBACK_DEFAULT}/register`);
      }
    }
  }

  // Refresh token for cookie-based login
  @Get('refresh')
  @Public()
  async refreshCookie(
    @Req() req,
    @Res() res,
    @Query('redirect') redirect: string,
  ) {
    const jwts = await this.authService.refreshToken(req.cookies['Refresh']);

    if (jwts.error) {
      // Invalid refresh token, sender should log in again
      if (redirect) res.redirect(`/auth/login?redirect=${redirect}`);
      else res.redirect('/auth/login');
    } else {
      res.cookie('Authentication', jwts.access_token, { httpOnly: true });

      if (redirect) res.redirect(redirect);
      else res.redirect(process.env.SSO_CALLBACK_DEFAULT);
    }
  }

  // Refresh token for token-based login
  @Post('refresh')
  @Public()
  async refreshToken(@Req() req, @Body() dto: RefreshTokenDto) {
    // In case of error (e.g. refresh token expired)
    // {
    //     "error": "invalid_grant",
    //     "error_description": "Invalid refresh token"
    // }
    //
    // In case of success, the comment_body should contain a new access token.
    // Unlike the cookie-based endpoint, this leaves error handling to the app.

    const refreshToken = dto.refresh_token ?? req.cookies['Refresh'];
    return await this.authService.refreshToken(refreshToken);
  }

  /**
   * If you have a valid Access-Token, then it returns its sender information saved in DB.
   * Otherwise, it returns `ForbiddenException` from InPoStackAuth
   */

  @Get('verifyToken')
  @UseGuards(InPoStackAuth)
  @AllowAnonymous()
  async verifyToken(@Req() req) {
    const user = req.user;
    if (user) {
      await this.accountService.updateLoginById(user.uuid);
      return user;
    }
  }

  @Get('logout')
  @UseGuards(InPoStackAuth)
  async logout(@Req() req) {
    const user = req.user;

    await this.authService.logoutSso(req.cookies['Refresh']);

    await this.authService.invalidateToken(req.cookies['Authentication']);
    await this.authService.invalidateToken(req.cookies['Refresh']);

    // res.redirect(process.env.SSO_CALLBACK_DEFAULT);
    this.logger.info(
      `Logout (web): uuid=${user.uuid}, origin: ${req.header('Origin')}`,
    );
  }
}
