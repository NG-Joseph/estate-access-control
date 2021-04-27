import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';

import { AppModule } from './app.module';

import * as FastifyFormBody from 'fastify-formbody';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,

    new FastifyAdapter(),
//cors options copiedfrom nestjs doc
    {
      cors: {
        origin: '*', 
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
        preflightContinue: false,
        optionsSuccessStatus: 204,
      },
      bodyParser: false, 
    },
  );

  app.register(FastifyFormBody as any);
  app.useGlobalPipes(new ValidationPipe());




// specify image,css directory for app
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

// specify template directory and set them to render with nunjucks
  app.setViewEngine({
    engine: {
      nunjucks: require('nunjucks'),
    },
    templates: join(__dirname, '..', 'views'),
  });





 

// app should listen and run when localhost:3000 is called
  await app.listen(3003, '0.0.0.0');

// print url for easy access
  console.log(`Application is running on: http://localhost:3003`);
}
bootstrap();
