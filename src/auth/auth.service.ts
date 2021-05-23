import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AccountService } from "../inpostack/account/account.service";
import { AccountStatus } from "../inpostack/account/account.meta";
import { JwtService } from "@nestjs/jwt";
import encryptPassword from "../utils/encryptPassword";

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService) {
  }

  /**
   * retrieving an account and verifying the password.
   */
  async validateAccount(id: string, pass: string): Promise<any> {
    const account = await this.accountService.findOneOrFail({ id: id });

    if (account.accountStatus != AccountStatus.activated) {
      throw new UnauthorizedException("Not activated account.");
    }

    const encryptedPassword = encryptPassword(pass, account.cryptoSalt);
    if (account.password === encryptedPassword) {
      const { password, cryptoSalt, lastLoginAt, accountStatus, ...info } = account;
      return info;
    }
  }

  /**
   * retrieving an account and verifying the password.
   */
  generateJwtToken(user: any) {
    // const payload = { id: user.id, name: user.name };
    // TODO: payload vs. user
    return this.jwtService.sign(user);
    // return this.jwtService.sign(payload);
  }
}
