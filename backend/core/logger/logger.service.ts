import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private context?: string;

  constructor(private configService: ConfigService) {
    const logLevel = this.configService.get<string>('logger.level') || 'info';
    const logToFile =
      this.configService.get<boolean>('logger.logToFile') || false;
    const logDirectory =
      this.configService.get<string>('logger.logDirectory') || './logs';

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
            const contextStr = context ? `[${context}]` : '';
            const metaStr = Object.keys(meta).length
              ? `\n${JSON.stringify(meta, null, 2)}`
              : '';
            return `${timestamp} ${level} ${contextStr} ${message}${metaStr}`;
          }),
        ),
      }),
    ];

    if (logToFile) {
      transports.push(
        new winston.transports.File({
          filename: `${logDirectory}/error.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: `${logDirectory}/combined.log`,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports,
    });
  }

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string, context?: string): void;
  log(message: string, meta?: object, context?: string): void;
  log(message: string, metaOrContext?: string | object, context?: string): void {
    const actualContext = typeof metaOrContext === 'string' ? metaOrContext : context;
    const meta = typeof metaOrContext === 'object' ? metaOrContext : {};
    
    this.logger.info(message, {
      context: actualContext || this.context,
      ...meta,
    });
  }

  info(message: string, meta?: object, context?: string): void {
    this.logger.info(message, {
      context: context || this.context,
      ...meta,
    });
  }

  error(message: string, trace?: string, context?: string): void;
  error(message: string, error?: Error, context?: string): void;
  error(message: string, meta?: object, context?: string): void;
  error(
    message: string,
    traceOrErrorOrMeta?: string | Error | object,
    context?: string,
  ): void {
    let meta: object = {};
    
    if (typeof traceOrErrorOrMeta === 'string') {
      meta = { trace: traceOrErrorOrMeta };
    } else if (traceOrErrorOrMeta instanceof Error) {
      meta = {
        error: traceOrErrorOrMeta.message,
        stack: traceOrErrorOrMeta.stack,
      };
    } else if (typeof traceOrErrorOrMeta === 'object') {
      meta = traceOrErrorOrMeta;
    }

    this.logger.error(message, {
      context: context || this.context,
      ...meta,
    });
  }

  warn(message: string, context?: string): void;
  warn(message: string, meta?: object, context?: string): void;
  warn(message: string, metaOrContext?: string | object, context?: string): void {
    const actualContext = typeof metaOrContext === 'string' ? metaOrContext : context;
    const meta = typeof metaOrContext === 'object' ? metaOrContext : {};
    
    this.logger.warn(message, {
      context: actualContext || this.context,
      ...meta,
    });
  }

  debug(message: string, context?: string): void;
  debug(message: string, meta?: object, context?: string): void;
  debug(message: string, metaOrContext?: string | object, context?: string): void {
    const actualContext = typeof metaOrContext === 'string' ? metaOrContext : context;
    const meta = typeof metaOrContext === 'object' ? metaOrContext : {};
    
    this.logger.debug(message, {
      context: actualContext || this.context,
      ...meta,
    });
  }

  verbose(message: string, context?: string): void;
  verbose(message: string, meta?: object, context?: string): void;
  verbose(message: string, metaOrContext?: string | object, context?: string): void {
    const actualContext = typeof metaOrContext === 'string' ? metaOrContext : context;
    const meta = typeof metaOrContext === 'object' ? metaOrContext : {};
    
    this.logger.verbose(message, {
      context: actualContext || this.context,
      ...meta,
    });
  }
}

