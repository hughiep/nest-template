import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import { LoggerService } from './logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Create custom morgan format
    morgan.token('duration', () => `${Date.now() - startTime}ms`);

    return morgan(
      '[:method] :url :status - :duration - :remote-addr - :user-agent',
      {
        stream: {
          write: (message) => {
            const statusCode = res.statusCode;
            if (statusCode >= 500) {
              this.logger.error(message.trim());
            } else if (statusCode >= 400) {
              this.logger.warn(message.trim());
            } else {
              this.logger.info(message.trim());
            }
          },
        },
      },
    )(req, res, next);
  }
}
