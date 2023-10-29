import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/allExceptionsFilter';
import { migrator } from './db/migration/migration';
import corsMiddleware from './middlewares/cors.middleware';
/* package and package-lock is imported to be included in the build */
import * as pjson from '../package.json';
import * as pjsonlock from '../package-lock.json';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    await migrator.up();
  } catch (e) {
    console.log(e);
    try {
      await migrator.down();
    } catch (error) {}
  }

  app.enableCors({
    origin: corsMiddleware,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix(`api/${process.env.API_VERSION}`, {
    exclude: [{ path: 'version', method: RequestMethod.GET }],
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  if (process.env.NODE_ENV !== 'development') {
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  }

  setupSwagger(app);
  await app.listen(process.env.PORT);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
