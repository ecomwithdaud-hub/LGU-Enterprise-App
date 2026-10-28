import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'An internal server error occurred. Please contact university support.';
    let errorType = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const errorObj = res as Record<string, any>;
        message = errorObj.message || message;
        errorType = errorObj.error || exception.name;
      }
    } else if (this.isPrismaError(exception)) {
      // Securely sanitize Prisma / SQL database errors so raw table names or SQL queries are NEVER leaked
      const prismaError = exception as any;
      const code = prismaError.code;

      this.logger.warn(`Prisma error caught [${code}]: ${prismaError.message}`);

      switch (code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          errorType = 'Conflict';
          message = 'A record with this unique identifier or field already exists.';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          errorType = 'Not Found';
          message = 'The requested resource could not be found.';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          errorType = 'Bad Request';
          message = 'Foreign key constraint failed. Referenced record does not exist.';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          errorType = 'Database Error';
          message = 'Database operation could not be completed with the provided parameters.';
          break;
      }
    } else {
      // Unhandled server runtime error: log full stack securely on server, return generic message to client
      this.logger.error(
        `Unhandled Exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred. No sensitive details have been exposed.';
      errorType = 'Internal Server Error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorType,
      message,
    });
  }

  private isPrismaError(err: any): boolean {
    return (
      err &&
      typeof err === 'object' &&
      (err.name === 'PrismaClientKnownRequestError' ||
        err.name === 'PrismaClientValidationError' ||
        err.name === 'PrismaClientInitializationError' ||
        err.name === 'PrismaClientRustPanicError')
    );
  }
}
