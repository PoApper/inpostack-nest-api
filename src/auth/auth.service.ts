import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { map } from 'rxjs/operators';
import * as queryString from 'querystring';

import { AccountService } from '../inpostack/account/account.service';
import { AccountStatus } from '../inpostack/account/account.meta';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginEvent } from '../event/user-login-event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private httpService: HttpService,
    @InjectRepository(UserLoginEvent)
    private readonly userLoginEventRepo: Repository<UserLoginEvent>,
  ) {}

  /**
   * retrieving an account and verifying the password.
   */
  async validateAccount(id: string, pass: string): Promise<any> {
    const account = await this.accountService.findOneOrFail({ id: id });
    console.log(pass);

    if (account.account_status != AccountStatus.activated) {
      throw new UnauthorizedException('Not activated account.');
    }
  }

  /**
   * PoApper SSO
   */

  async getToken(
    session_state: string,
    code: string,
    redirect?: string,
    login_type?: string,
  ) {
    return this.httpService
      .post(
        process.env.SSO_BASE_END + '/token',
        queryString.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.SSO_CLIENT,
          client_secret: process.env.SSO_SECRET,
          code: code,
          redirect_uri:
            process.env.SSO_REDIRECT +
            (redirect ? '?redirect=' + redirect : '') +
            (login_type ? '?login_type=' + login_type : ''),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          responseType: 'json',
        },
      )
      .pipe(map((response) => response.data))
      .toPromise();
  }

  // Get a new access token from a refresh token
  async refreshToken(refreshToken: string) {
    return this.httpService
      .post(
        process.env.SSO_BASE_END + '/token',
        queryString.stringify({
          grant_type: 'refresh_token',
          client_id: process.env.SSO_CLIENT,
          client_secret: process.env.SSO_SECRET,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map((response) => response.data))
      .toPromise();
  }

  async logoutSso(refreshToken: string) {
    return this.httpService
      .post(
        process.env.SSO_BASE_END + '/logout',
        queryString.stringify({
          grant_type: 'client_credentials',
          client_id: process.env.SSO_CLIENT,
          client_secret: process.env.SSO_SECRET,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .toPromise();
  }

  async invalidateToken(token: string) {
    return this.httpService
      .post(
        process.env.SSO_BASE_END + '/revoke',
        queryString.stringify({
          grant_type: 'client_credentials',
          client_id: process.env.SSO_CLIENT,
          client_secret: process.env.SSO_SECRET,
          token: token,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .toPromise();
  }

  saveUserLoginEvent(user_uuid: string) {
    return this.userLoginEventRepo.save({ user_uuid: user_uuid });
  }
}
