import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Request, Response } from 'express';
import {
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from 'generated/prisma/internal/prismaNamespace';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  // Map Prisma error codes to user-friendly messages
  private _mapPrismaCodeToMessage(code: string): string {
    const map: Record<string, string> = {
      P2000: 'Value too long for column.',
      P2001: 'Record not found (no matching record).',
      P2002: 'Duplicate record. A unique constraint would be violated.',
      P2003: 'Foreign key constraint failed.',
      P2004: 'Database constraint failed.',
      P2005: 'Invalid value for field type.',
      P2006: 'Invalid format for field.',
      P2007: 'Data validation error.',
      P2008: 'Failed to parse query.',
      P2009: 'Failed to validate query.',
      P2010: 'Raw query execution failed.',
      P2011: 'Null constraint violation.',
      P2012: 'Missing required value.',
      P2013: 'Missing required argument.',
      P2014: 'Nested write relation violation.',
      P2015: 'Related record not found.',
      P2016: 'Query interpretation error.',
      P2017: 'Parent-child relation not connected.',
      P2018: 'Required connected records not found.',
      P2019: 'Input error.',
      P2020: 'Value out of range for type.',
      P2021: 'Table does not exist.',
      P2022: 'Column does not exist.',
      P2023: 'Inconsistent column data.',
      P2024: 'Transaction timed out while waiting for a database connection.',
      P2025: 'Record not found or already deleted.',
      P2026: 'Feature not supported by database provider.',
      P2027: 'Multiple errors during query execution.',
      P5011: 'Too many requests – rate limit.',
      P6004: 'Query timeout.',
      P6008: 'Prisma engine connection failure.',
      P6009: 'Response size exceeds limit.',
    };
    return map[code] ?? `Internal Server Error. Please Try again later.`;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(request.url, 'url', exception, 'exception');

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';

    if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = this._mapPrismaCodeToMessage(exception.code);
    } else if (exception instanceof PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = 'Invalid Prisma query or parameters';
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Unknown Prisma error';
    } else if (
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientInitializationError
    ) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      errorMessage = 'Prisma engine failure. Please try again later.';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorMessage =
        typeof res === 'string'
          ? res
          : (res as any)?.message || JSON.stringify(res);
    } else if (exception instanceof Error) {
      // Fallback generic error
      errorMessage = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
    });
  }
}
