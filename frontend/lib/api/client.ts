import { ApiError, ApiResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const TOKEN_STORAGE_KEY = 'auth_tokens';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    
    const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  private setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('auth_user');
  }

  private onRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private async refreshAccessToken(): Promise<string | null> {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return null;
      }

      const newTokens = await response.json();
      this.setTokens(newTokens);
      return newTokens.accessToken;
    } catch (error) {
      this.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth = false,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }

    if (!skipAuth) {
      const tokens = this.getTokens();
      if (tokens?.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/refresh')) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onRefreshed(newToken);
            return this.request<T>(endpoint, options, skipAuth);
          }
        } else {
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber((token: string) => {
              if (token) {
                resolve(this.request<T>(endpoint, options, skipAuth));
              } else {
                reject(new ApiClientError('Token refresh failed', 401, 'Unauthorized'));
              }
            });
          });
        }
      }

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

  async get<T>(endpoint: string, options?: RequestInit, skipAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    }, skipAuth);
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
    skipAuth = false,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }, skipAuth);
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
    skipAuth = false,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }, skipAuth);
  }

  async delete<T>(endpoint: string, options?: RequestInit, skipAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    }, skipAuth);
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

