import { ApiError, ApiResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(data);
      }

      if (data.data !== undefined) {
        return (data as ApiResponse<T>).data;
      }

      return data;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiClientError(error.message, 0, 'NetworkError');
      }

      throw new ApiClientError('An unexpected error occurred', 0, 'UnknownError');
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  private handleError(error: ApiError): ApiClientError {
    const message = Array.isArray(error.message)
      ? error.message.join(', ')
      : error.message || 'An error occurred';

    return new ApiClientError(
      message,
      error.statusCode,
      error.error || 'ApiError'
    );
  }
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorType: string
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

