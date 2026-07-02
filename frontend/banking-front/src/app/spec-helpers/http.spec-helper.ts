import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PagedResponse } from '@core/interface';

export interface HttpServiceTestContext<T> {
  service: T;
  http: HttpTestingController;
}

export function setupHttpService<T>(
  serviceType: Type<T>,
): HttpServiceTestContext<T> {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  return {
    service: TestBed.inject(serviceType),
    http: TestBed.inject(HttpTestingController),
  };
}

export function expectRequest(
  http: HttpTestingController,
  urlIncludes: string,
  method: string,
): TestRequest {
  const request = http.expectOne((req) => req.url.includes(urlIncludes));
  expect(request.request.method).toBe(method);
  return request;
}

export function expectParams(
  request: TestRequest,
  params: Record<string, string>,
): void {
  Object.entries(params).forEach(([key, value]) => {
    expect(request.request.params.get(key)).toBe(value);
  });
}

export function expectMissingParams(
  request: TestRequest,
  paramNames: string[],
): void {
  paramNames.forEach((paramName) => {
    expect(request.request.params.has(paramName)).toBe(false);
  });
}

export function pagedResponse<T>(
  content: T[],
  overrides: Partial<PagedResponse<T>> = {},
): PagedResponse<T> {
  return {
    content,
    page: 1,
    size: content.length,
    totalElements: content.length,
    totalPages: 1,
    first: true,
    last: true,
    ...overrides,
  };
}
