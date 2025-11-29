import {
  inject,
  InjectOptions,
  Response as LightMyRequestResponse,
} from 'light-my-request';

/**
 * Helper utility for Light-My-Request to reduce boilerplate
 *
 * Usage:
 *   const { statusCode, body } = await makeRequest(
 *     httpServer,
 *     'POST',
 *     '/auth/login',
 *     { email, password }
 *   );
 */

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  payload?: any;
  headers?: Record<string, string>;
  query?: Record<string, string>;
}

export interface RequestResponse {
  statusCode: number;
  body: any;
  headers: Record<string, string | string[] | number | undefined>;
  raw: LightMyRequestResponse;
}

export async function makeRequest(
  httpServer: any,
  options: RequestOptions,
): Promise<RequestResponse> {
  const injectOptions: InjectOptions = {
    method: options.method,
    url: options.url,
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
  };

  if (options.payload) {
    injectOptions.payload = JSON.stringify(options.payload);
  }

  if (options.query) {
    const queryString = new URLSearchParams(options.query).toString();
    injectOptions.url = `${options.url}?${queryString}`;
  }

  const response = await inject(httpServer, injectOptions);

  let body: any = null;
  if (response.payload) {
    try {
      body = JSON.parse(response.payload);
    } catch {
      body = response.payload;
    }
  }

  return {
    statusCode: response.statusCode,
    body,
    headers: response.headers,
    raw: response,
  };
}

/**
 * Shorthand helpers for common HTTP methods
 */

export async function get(
  httpServer: any,
  url: string,
  headers?: Record<string, string>,
): Promise<RequestResponse> {
  return makeRequest(httpServer, { method: 'GET', url, headers });
}

export async function post(
  httpServer: any,
  url: string,
  payload: any,
  headers?: Record<string, string>,
): Promise<RequestResponse> {
  return makeRequest(httpServer, { method: 'POST', url, payload, headers });
}

export async function put(
  httpServer: any,
  url: string,
  payload: any,
  headers?: Record<string, string>,
): Promise<RequestResponse> {
  return makeRequest(httpServer, { method: 'PUT', url, payload, headers });
}

export async function patch(
  httpServer: any,
  url: string,
  payload: any,
  headers?: Record<string, string>,
): Promise<RequestResponse> {
  return makeRequest(httpServer, { method: 'PATCH', url, payload, headers });
}

export async function del(
  httpServer: any,
  url: string,
  headers?: Record<string, string>,
): Promise<RequestResponse> {
  return makeRequest(httpServer, { method: 'DELETE', url, headers });
}

/**
 * Helper to extract bearer token from login response
 */
export function extractToken(loginResponse: RequestResponse): string {
  return loginResponse.body?.data?.accessToken || '';
}

/**
 * Helper to create authorization header
 */
export function authHeader(token: string): Record<string, string> {
  return {
    authorization: `Bearer ${token}`,
  };
}
