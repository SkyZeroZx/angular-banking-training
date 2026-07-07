import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FeatureHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{ path?: string; url?: string }>();
    const response = http.getResponse<{
      setHeader?: (name: string, value: string) => void;
      header?: (name: string, value: string) => void;
    }>();
    const path = (request.path ?? request.url ?? '').split('?')[0];

    if (path === '/auth/login') {
      setHeader(response, 'X-Feature-clients', 'true');
      setHeader(response, 'X-Feature-accounts', 'true');
      setHeader(response, 'X-Feature-transactions', 'true');
      setHeader(response, 'X-Feature-reports', 'true');
    }

    return next.handle();
  }
}

function setHeader(
  response: { setHeader?: (name: string, value: string) => void; header?: (name: string, value: string) => void },
  name: string,
  value: string,
) {
  if (typeof response.setHeader === 'function') {
    response.setHeader(name, value);
    return;
  }
  response.header?.(name, value);
}
