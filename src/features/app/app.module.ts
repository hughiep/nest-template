import { Module, type MiddlewareConsumer } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { HealthModule } from '@features/health/health.module';
import { HttpLoggerMiddleware } from '@core/logger/http-logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule, SharedModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
