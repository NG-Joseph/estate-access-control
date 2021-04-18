import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator for injecting Authenticated Users
 */
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);