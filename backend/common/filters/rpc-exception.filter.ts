import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilterImpl implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(RpcExceptionFilterImpl.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    
    this.logger.error('RPC Exception:', JSON.stringify(error));

    // Transform RPC exception to structured error
    const errorResponse = {
      statusCode: (error as any).statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      message: (error as any).message || 'Internal server error',
      error: (error as any).error || 'RpcException',
      timestamp: new Date().toISOString(),
    };

    return throwError(() => errorResponse);
  }
}

