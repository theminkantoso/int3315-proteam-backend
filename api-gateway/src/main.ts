import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  const AUTH_SERVICE_URL =
    process.env.ENVIRONMENT == 'docker'
      ? process.env.AUTH_SERVICE
      : process.env.AUTH_SERVICE_TUYEN;
  const USER_SERVICE_URL =
    process.env.ENVIRONMENT == 'docker'
      ? process.env.USER_SERVICE
      : process.env.USER_SERVICE_TUYEN;
  const POST_SERVICE_URL =
    process.env.ENVIRONMENT == 'docker'
      ? process.env.POST_SERVICE
      : process.env.POST_SERVICE_TUYEN;
  const CHAT_SERVICE_URL =
    process.env.ENVIRONMENT == 'docker'
      ? process.env.CHAT_SERVICE
      : process.env.CHAT_SERVICE_TUYEN;
  const NOTI_SERVICE_URL =
    process.env.ENVIRONMENT == 'docker'
      ? process.env.NOTI_SERVICE
      : process.env.NOTI_SERVICE_TUYEN;
  const STATS_SERVICE_URL =
    process.env.ENVIRONMENT == 'docker'
      ? process.env.STATS_SERVICE
      : process.env.STATS_SERVICE_TUYEN;

  console.log('first', AUTH_SERVICE_URL);

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

  app.use(
    '/noti',
    createProxyMiddleware({
      target: NOTI_SERVICE_URL,
      changeOrigin: true,
    }),
  );

  app.use(
    '/stats',
    createProxyMiddleware({
      target: STATS_SERVICE_URL,
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
