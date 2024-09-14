import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = this.getStatus(exception);

    if (exception instanceof BadRequestException) {
      return response.status(status).json(exception.getResponse());
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.getMessage(exception, status),
    };

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getMessage(exception: unknown, status: HttpStatus): string {
    if (exception instanceof HttpException) {
      if (status === 401) {
        return 'Not authorized to access the URL';
      }

      return exception.message;
    }
    return 'Internal server error';
  }
}
