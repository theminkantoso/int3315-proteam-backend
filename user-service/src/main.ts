import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const corsOptions: CorsOptions = {
    origin: '*',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Timezone',
      'X-Timezone-Name',
    ],
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  };
  app.enableCors(corsOptions);
  app.setGlobalPrefix('/user');

  const config = new DocumentBuilder()
    .setTitle('USER-SERVICE')
    .setDescription('The USER Service description')
    .setVersion('1.0')
    .addTag('USER-SERVICE')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/user/api', app, document);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3002);
}
bootstrap();
