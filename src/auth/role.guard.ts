import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import { Account } from "../inpostack/account/account.entity";

@Injectable()
export class AccountTypeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredTypes = this.reflector.get<string[]>('account_types', context.getHandler());

    if (!requiredTypes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const account: Account = request.user; // account entity injected by AuthGuard

    const isOk = requiredTypes.some((type) => account.accountType?.includes(type));

    if (!isOk) {
      throw new UnauthorizedException("Unauthorized AccountType");
    }

    return isOk;
  }
}