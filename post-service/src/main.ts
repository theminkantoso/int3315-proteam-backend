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
  app.setGlobalPrefix('/posts');

  const config = new DocumentBuilder()
    .setTitle('POST-SERVICE')
    .setDescription('The POST Service description')
    .setVersion('1.0')
    .addTag('POST-SERVICE')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/posts/api', app, document);
  await app.listen(3003);
}
bootstrap();