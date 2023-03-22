import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/user');

  const config = new DocumentBuilder()
    .setTitle('USER-SERVICE')
    .setDescription('The USER Service description')
    .setVersion('1.0')
    .addTag('USER-SERVICE')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/user/api', app, document);
  await app.listen(3002);
}
bootstrap();
