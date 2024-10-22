import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
    ]),
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        transport: Transport.TCP,
        options: { port: 3003 },
      },
    ]),
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.TCP,
        options: { port: 3004 },
      },
    ]),

    ClientsModule.register([
      {
        name: 'NOTI_SERVICE',
        transport: Transport.TCP,
        options: { port: 3005 },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
