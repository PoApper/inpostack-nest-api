import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountService } from '../../inpostack/account/account.service';

/**
 * If you want to use this Guard, then use this decorator pattern:
 * <pre>
 * @UseGuards(InPoStackAuth)
 * </pre>
 * You can use this in specific routes or a controller.
 * It you want to use with @Public, then use @SSPPublicType decorator with!
 * @author HSY
 */

@Injectable()
export class InPoStackAuth implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accountService: AccountService,
  ) {}

  /**
   * return true -> pass ssp Auth test, or not user login<br>
   * return false -> invalid keycloak_id, throw "403 Forbidden resource"
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // option for how to handle non-login user
    const acceptPublic: boolean = this.reflector.get<boolean>(
      'allowAnonymous',
      context.getHandler(),
    );

    if (!user || !user.sub) {
      if (acceptPublic) {
        request.user = null; // not throw Exception, just attach null.
        return true;
      } else {
        throw new ForbiddenException('Not SSP User');
      }
    }

    const existUser = await this.accountService.findOne({
      keycloak_id: user.sub,
    });
    if (!existUser) {
      throw new ForbiddenException('SSO User, but not SSP User');
    }
    request.user = existUser; // replace req.sender into DB sender information
    return true;
  }
}
