import { Global, Module } from '@nestjs/common';
import { LoggerService } from '@core/logger/logger.service';

import { HttpExceptionFilter } from './filters/http-exception.filter';

@Global()
@Module({
  providers: [
    {
      provide: HttpExceptionFilter,
      useFactory: (logger: LoggerService) => new HttpExceptionFilter(logger),
      inject: [LoggerService],
    },
  ],
  exports: [HttpExceptionFilter],
})
export class SharedModule {}
