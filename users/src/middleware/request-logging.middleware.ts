import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl } = req;

    this.logger.log(
      `Start ${method} ${originalUrl} at ${new Date(start).toISOString()}`,
    );

    res.on('finish', () => {
      const end = Date.now();
      const { statusCode } = res;
      const duration = end - start;
      this.logger.log(
        `End ${method} ${originalUrl} with status ${statusCode} at ${new Date(end).toISOString()} (Duration: ${duration}ms)`,
      );
    });

    next();
  }
}
