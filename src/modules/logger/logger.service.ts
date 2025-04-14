/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';

import { NodeEnv } from '../../config/schemas/env.schema';

@Injectable()
export class LoggerService {
  private logger: WinstonLogger;

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = this.configService.get('NODE_ENV');

    this.logger = createLogger({
      level: nodeEnv === NodeEnv.Production ? 'info' : 'debug',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      transports: [
        // Write all logs with level `error` and below to `error.log`
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Write all logs with level `info` and below to `combined.log`
        new transports.File({ filename: 'logs/combined.log' }),
        // Write all logs to console in development
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(
              ({ timestamp, level, message, ...meta }) =>
                `${timestamp} [${level}]: ${message} ${
                  Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                }`,
            ),
          ),
        }),
      ],
    });
  }

  error(message: string, ...meta: any[]) {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: any[]) {
    this.logger.warn(message, ...meta);
  }

  info(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }

  debug(message: string, ...meta: any[]) {
    this.logger.debug(message, ...meta);
  }
}
