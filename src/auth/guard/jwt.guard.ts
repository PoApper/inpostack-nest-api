import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Optional } from '@nestjs/common';
import { ALLOW_ANONYMOUS_META_KEY } from '../decorator/anonymous.decorator';

export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    @Optional() protected readonly options: AuthModuleOptions,
    private readonly reflector: Reflector,
  ) {
    super(options);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
      return true;
    } catch (err) {
      // Handle anonymous access
      const isAnonymousAllowed =
        this.reflector.get<boolean>(
          ALLOW_ANONYMOUS_META_KEY,
          context.getHandler(),
        ) ||
        this.reflector.get<boolean>(
          ALLOW_ANONYMOUS_META_KEY,
          context.getClass(),
        );

      if (isAnonymousAllowed) {
        return true;
      }

      throw err;
    }
  }
}
