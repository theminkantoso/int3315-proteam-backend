import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const AUTH_SERVICE_URL = "http://auth_service:3001";
  const USER_SERVICE_URL = "http://user_service:3002";
  const POST_SERVICE_URL = "http://post_service:3003";
  const CHAT_SERVICE_URL = "http://chat_service:3004";

  // for localhost
  // const AUTH_SERVICE_URL = 'http://localhost:3001';
  // const USER_SERVICE_URL = 'http://localhost:3002';
  // const POST_SERVICE_URL = 'http://localhost:3003';
  // const CHAT_SERVICE_URL = 'http://localhost:3004';

  // Proxy endpoints
  app.use(
    '/auth',
    createProxyMiddleware({
      target: AUTH_SERVICE_URL,
      changeOrigin: true,
    }),
  );

  app.use(
    '/user',
    createProxyMiddleware({
      target: USER_SERVICE_URL,
      changeOrigin: true,
    }),
  );

  app.use(
    '/posts',
    createProxyMiddleware({
      target: POST_SERVICE_URL,
      changeOrigin: true,
    }),
  );

  app.use(
    '/chats',
    createProxyMiddleware({
      target: CHAT_SERVICE_URL,
      changeOrigin: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API-GATEWAY')
    .setDescription('The API Gateway description')
    .setVersion('1.0')
    .addTag('API-GATEWAY')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
