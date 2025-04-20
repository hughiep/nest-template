import { Module, type MiddlewareConsumer } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { HealthModule } from '@features/health/health.module';
import { HttpLoggerMiddleware } from '@core/logger/http-logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@core/config/database.module';

import { AppEntity } from './features/app/app.entity';
import { AppController } from './features/app/app.controller';
import { AppService } from './features/app/app.service';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    HealthModule,
    DatabaseModule,
    TypeOrmModule.forFeature([AppEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
