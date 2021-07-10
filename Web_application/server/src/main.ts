import { NestFactory } from '@nestjs/core';
import * as pjson from 'pjson';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    exposedHeaders: [
      'authorization',
      'content-type',
      'content-disposition'
    ]
  })
  const NodeMediaServer = require('node-media-server');
 
  const mediaConfig = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: 8000,
      allow_origin: '*'
    }
  };
 
  var nms = new NodeMediaServer(mediaConfig)
  

  const config = new DocumentBuilder()
    .setTitle(pjson.name)
    .setDescription(pjson.description)
    .setVersion(pjson.version)
    .addBearerAuth({
      bearerFormat: 'JWT',
      type: 'http',
      scheme: 'bearer'
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  nms.run();
  await app.listen(process.env.PORT, '192.168.1.9');
}
bootstrap();
