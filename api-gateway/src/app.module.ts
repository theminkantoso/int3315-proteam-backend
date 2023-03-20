import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ 
  //   ClientsModule.register([
  //   {
  //     name: 'POST_SERVICE', 
  //     transport: Transport.TCP,
  //     options: { port: 3000 },
  //   },
  // ]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
