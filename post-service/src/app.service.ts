import { Inject, Injectable } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly users: any[] = [];

  // constructor(@Inject('API-GATEWAY') private readonly api_gateway: ClientProxy,
  // ) {}
  getHello(): string {
    return 'Hello World POST SERVICE!';
  }
}
