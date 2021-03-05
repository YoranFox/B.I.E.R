import * as pjson from 'pjson';
import * as dotenv from 'dotenv';
dotenv.config()
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {logger: false});

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
    console.log(JSON.stringify(document, null, 2));
    process.exit(0)
}
bootstrap();