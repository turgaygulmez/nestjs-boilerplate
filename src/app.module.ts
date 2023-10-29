import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientModule } from './modules';

import { ConfigModule } from '@nestjs/config';
import { AutomapperModule } from '@automapper/nestjs';
import { sequelize } from '@automapper/sequelize';
import { DatabaseModule } from './db/db.module';
import { MapperProfile } from './providers/automapper.provider';
import { AppController } from './app.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RoleMiddleware } from './middlewares/role.middleware';
import { GLOBAL_CACHE_TTL, PROTECTED_ROUTES } from './constants';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AllowCacheInterceptor } from './interceptors/allowCache.interceptor';
import { redisStore } from 'cache-manager-ioredis-yet';
import * as fs from 'fs';

const getAppModules = () => {
  const modules = [
    DatabaseModule,
    ConfigModule.forRoot(),
    AutomapperModule.forRoot({
      strategyInitializer: sequelize(),
    }),
    ScheduleModule.forRoot(),
  ];

  if (+process.env.ENABLE_REDIS) {
    modules.push(
      CacheModule.register({
        ttl: GLOBAL_CACHE_TTL,
        isGlobal: true,
        store: async () => {
          const cert = fs.readFileSync(process.env.REDIS_CERT_PATH);

          return await redisStore({
            name: 'mymaster',
            ttl: GLOBAL_CACHE_TTL,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            showFriendlyErrorStack: true,
            enableTLSForSentinelMode: true,
            sentinels:
              process.env.REDIS_SENTINELS &&
              JSON.parse(process.env.REDIS_SENTINELS),
            tls: {
              rejectUnauthorized: true,
              servername: 'mymaster',
              checkServerIdentity: () => undefined,
              ca: [cert],
            },
            sentinelTLS: {
              rejectUnauthorized: true,
              servername: 'mymaster',
              checkServerIdentity: () => undefined,
              ca: [cert],
            },
          });
        },
      }),
    );
  }

  modules.push(ClientModule);

  return modules;
};

const getAppProviders = () => {
  const providers = [];

  if (+process.env.ENABLE_REDIS) {
    providers.push({
      provide: APP_INTERCEPTOR,
      useClass: AllowCacheInterceptor,
    });
  }

  providers.push(MapperProfile);

  return providers;
};

@Module({
  imports: getAppModules(),
  controllers: [AppController],
  providers: getAppProviders(),
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /* Apply authentication restriction */
    consumer.apply(AuthMiddleware).forRoutes('*');
    /* Apply role based restriction */
    PROTECTED_ROUTES.forEach((route) => {
      consumer.apply(RoleMiddleware).forRoutes({
        path: route.path,
        method: RequestMethod.ALL,
      });
    });
  }
}
