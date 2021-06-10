import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';

import { AppModule } from './app.module';

import * as FastifyFormBody from 'fastify-formbody';
import { NotFoundExceptionFilter } from './global/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,

    new FastifyAdapter(),

    {
      bodyParser: false,
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: true,
        optionsSuccessStatus: 204,
        credentials: true
      },
    },
  );
  //app.register(FastifyFormBody as any)
  app.register(require('fastify-formbody')); // Couldn't submit forms to backend (application/x-www-form-urlencoded) this fixed that
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new NotFoundExceptionFilter()); //add exception filter to show 404 page whenever an unexisting url on server is requested
  // specify assets directory for app
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  // Set render engine as nunjucks and specify template directory
  app.setViewEngine({
    engine: {
      nunjucks: require('nunjucks'),
    },
    templates: join(__dirname, '..', 'views'),
  });

  // app should listen and run when localhost:3003 is called
  const port = 3003;

  await app.listen(port, '0.0.0.0');

  // print url for easy access
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
