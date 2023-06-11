import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
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
  const port = process.env.PORT || 3000;
  const environment = process.env.ENVIRONMENT;

  const serviceUrl = {
    auth:
      environment === 'prod'
        ? process.env.AUTH_SERVICE
        : 'http://localhost:3001',
    user:
      environment === 'prod'
        ? process.env.USER_SERVICE
        : 'http://localhost:3002',
    post:
      environment === 'prod'
        ? process.env.POST_SERVICE
        : 'http://localhost:3003',
    chat:
      environment === 'prod'
        ? process.env.CHAT_SERVICE
        : 'http://localhost:3004',
    noti:
      environment === 'prod'
        ? process.env.NOTI_SERVICE
        : 'http://localhost:3005',
    stats:
      environment === 'prod'
        ? process.env.STATS_SERVICE
        : 'http://localhost:3006',
  };

  // Proxy endpoints
  app.use(
    '/auth',
    createProxyMiddleware({
      target: serviceUrl.auth,
      changeOrigin: true,
    }),
  );

  app.use(
    '/user',
    createProxyMiddleware({
      target: serviceUrl.user,
      changeOrigin: true,
    }),
  );

  app.use(
    '/posts',
    createProxyMiddleware({
      target: serviceUrl.post,
      changeOrigin: true,
    }),
  );

  app.use(
    '/chats',
    createProxyMiddleware({
      target: serviceUrl.chat,
      changeOrigin: true,
    }),
  );

  app.use(
    '/noti',
    createProxyMiddleware({
      target: serviceUrl.noti,
      changeOrigin: true,
    }),
  );

  app.use(
    '/stats',
    createProxyMiddleware({
      target: serviceUrl.stats,
      changeOrigin: true,
    }),
  );

  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: serviceUrl.noti,
      changeOrigin: true,
      ws: false,
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
