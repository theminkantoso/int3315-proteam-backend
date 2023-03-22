import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
