import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';

import { AppModule } from './app.module';

import {createProxyMiddleware} from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  const POST_SERVICE_URL = "http://localhost:3001";
  const TASKS_SERVICE_URL = "http://localhost:3332";

  // Proxy endpoints
  app.use('/posts', createProxyMiddleware({
    target: POST_SERVICE_URL,
    changeOrigin: true,
  }));
  // app.use('/api/tasks', createProxyMiddleware({
  //   target: TASKS_SERVICE_URL,
  //   changeOrigin: true,
  // }));
  await app.listen(port);
  // Logger.log(
  //   `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  // );
}
bootstrap();
