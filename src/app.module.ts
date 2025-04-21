import { Module, type MiddlewareConsumer } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { HealthModule } from '@features/health/health.module';
import { HttpLoggerMiddleware } from '@core/logger/http-logger.middleware';
import { DatabaseModule } from '@core/config/database.module';

import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    HealthModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
