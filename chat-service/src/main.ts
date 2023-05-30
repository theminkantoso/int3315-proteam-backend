import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('/chats');

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

  const config = new DocumentBuilder()
    .setTitle('CHAT SERVICE')
    .setDescription('The Chat Service description')
    .setVersion('1.0')
    .addTag('CHAT-SERVICE')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('chats/api', app, document);
  await app.listen(3004);
}
bootstrap();
