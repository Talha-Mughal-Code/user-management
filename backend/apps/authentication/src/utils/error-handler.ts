import { RpcException } from '@nestjs/microservices';
import { ERROR_MESSAGES } from '@common/constants/error-messages';

/**
 * Handles errors by converting them to RPC exceptions
 * @param error The error object to handle
 * @throws RpcException with appropriate status code and message
 */
export function handleRpcError(error: unknown): never {
  const status =
    error && typeof error === 'object' && 'status' in error
      ? (error.status as number)
      : error && typeof error === 'object' && 'statusCode' in error
        ? (error.statusCode as number)
        : 500;

  const message =
    error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;

  const errorType =
    error && typeof error === 'object' && 'error' in error
      ? (error.error as string)
      : 'InternalServerError';

  throw new RpcException({
    statusCode: status,
    message,
    error: errorType,
  });
}
