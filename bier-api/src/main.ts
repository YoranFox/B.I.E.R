import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { RequestLogger } from './interceptors/request-logger.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    exposedHeaders: ['authorization', 'content-type', 'content-disposition'],
  });

  app.useGlobalInterceptors(new RequestLogger());
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  const config = new DocumentBuilder()
    .setTitle('Project bier')
    .setDescription('The API for Project B.I.E.R documentation')
    .setVersion('1.0')
    .addTag('B.I.E.R')
    .addBearerAuth({
      bearerFormat: 'JWT',
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
