import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthUtil } from '../utils';
import { PROTECTED_ROUTES } from '../constants';
import pathToRegexp from 'path-to-regexp';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const reqUrl = req.baseUrl.replace(`/api/${process.env.API_VERSION}`, '');

    const protectedRoute = PROTECTED_ROUTES.find((x) => {
      const regexp = pathToRegexp(x.path);
      return !!regexp.exec(reqUrl);
    });

    // all routes has to be protected
    if (!protectedRoute) {
      throw new UnauthorizedException();
    }

    if (protectedRoute.isPublic) {
      next();
      return;
    }

    try {
      AuthUtil.setToken(req);
    } catch (e) {
      throw new UnauthorizedException();
    }

    /**
     * Validate JWT token against JWT secret
     */
    try {
      verify(AuthUtil.authorization, process.env.JWT_SECRET);
      next();
    } catch (ex) {
      throw new UnauthorizedException();
    }
  }
}
