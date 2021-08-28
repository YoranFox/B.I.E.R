import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

process.env.SWAGGER_BUILD = 'true'

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
      logger: false,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Project bier')
    .setDescription('The API for Project B.I.E.R documentation')
    .setVersion('1.0')
    .addTag('B.I.E.R')
    .addBearerAuth(
      {
        bearerFormat: 'JWT',
        type: 'http',
        scheme: 'bearer'
      }
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log(JSON.stringify(document, null, 2));
  process.exit(0);
}
bootstrap();