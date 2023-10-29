import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CACHE_METADATA, CACHE_PREFIX } from '../constants';

@Injectable()
export class AllowCacheInterceptor extends CacheInterceptor {
  httpServer: any;
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const isGetRequest = request.method === 'GET';
    let requestURl = request.url;

    if (requestURl && requestURl[0] === '/') {
      requestURl = requestURl.replace('/', '');
    }

    const allowCachingController: boolean = this.reflector.get(
      CACHE_METADATA,
      context.getClass(),
    );

    const allowCachingMethod: boolean = this.reflector.get(
      CACHE_METADATA,
      context.getHandler(),
    );

    if ((allowCachingController || allowCachingMethod) && isGetRequest) {
      return `${CACHE_PREFIX}${requestURl}`;
    }

    return undefined;
  }
}
