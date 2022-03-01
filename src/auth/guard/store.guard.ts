import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AccountType } from '../../inpostack/account/account.meta';
import { StoreService } from '../../inpostack/market/store/store.service';

/**
 * Return Store information
 * Usage
 * @UseGuards(InPoStackAuth, AccountTypeGuard, StoreGuard)
 * @AccountTypes(AccountType.storeOwner)
 * controllerFun() {...}
 */

@Injectable()
export class StoreGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}

  /**
   * return true -> attach store information into req.user.store
   * return false -> not store_owner type, throw "403 Forbidden resource"
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No Auth Token');
    }

    if (user.account_type !== AccountType.storeOwner) {
      throw new ForbiddenException('Not Store Owner');
    }

    // inject store information
    request.user.store = await this.storeService.findOneOrFail({
      where: { owner_uuid: user.uuid },
    });

    return true;
  }
}
