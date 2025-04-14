import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
