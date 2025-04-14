import { Global, Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  providers: [
    {
      provide: ThrottlerGuard,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ConfigModule, LoggerModule, ThrottlerGuard],
})
export class CoreModule {}
