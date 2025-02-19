import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(@Inject('POST_SERVICE') private readonly post: ClientProxy) { }

  @Get()
  getHello(): string {
    return 'what?';
  }
}
