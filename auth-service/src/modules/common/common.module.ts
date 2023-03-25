import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/common/services/mysql.service';
import { CommonController } from './common.controller';
import { CommonDropdownService } from './services/common-dropdown.service';
import { GlobalDataService } from './services/global-data.service';

@Global()
@Module({
    controllers: [CommonController],
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(),
        },
        DatabaseService,
        CommonDropdownService,
        GlobalDataService,
    ],
    exports: [ConfigService, GlobalDataService],
})
export class CommonModule {}
