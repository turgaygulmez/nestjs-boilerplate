import {
  Injectable,
  NestMiddleware,
  RequestMethod,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthUtil } from '../utils';
import { PROTECTED_ROUTES } from '../constants';
import pathToRegexp from 'path-to-regexp';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const protectedRoute = PROTECTED_ROUTES.find((x) => {
      const regexp = pathToRegexp(x.path);
      return !!regexp.exec(
        req.url.replace(`/api/${process.env.API_VERSION}`, ''),
      );
    });

    if (!protectedRoute) {
      throw new UnauthorizedException();
    }

    if (protectedRoute.isPublic) {
      next();
      return;
    }

    const requiredRoles =
      protectedRoute?.methods[RequestMethod[req.method]] ||
      protectedRoute?.methods[RequestMethod.ALL];

    if (!requiredRoles) {
      throw new UnauthorizedException();
    }

    // no claim required
    if (!requiredRoles?.length) {
      next();
      return;
    }

    const roles = AuthUtil.getUserRoles();

    let hasClaimAccess = false;

    // if user has one of the required claim, continue the process
    requiredRoles.forEach((requiredRole: string) => {
      if (roles.find((x) => x === requiredRole)) {
        hasClaimAccess = true;
      }
    });

    if (!hasClaimAccess) {
      throw new UnauthorizedException();
    }

    next();
  }
}
