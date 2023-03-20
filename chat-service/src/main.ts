import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/chats');
  const config = new DocumentBuilder()
    .setTitle('CHAT SERVICE')
    .setDescription('The Chat Service description')
    .setVersion('1.0')
    .addTag('CHAT-SERVICE')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('chats/api', app, document);
  await app.listen(3002);
}
bootstrap();
