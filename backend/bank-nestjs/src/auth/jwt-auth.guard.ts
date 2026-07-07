import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GatewayUnauthorizedError } from '../common/domain-error';

interface HttpRequestLike {
  method: string;
  path?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HttpRequestLike>();
    const path = (request.path ?? request.url ?? '').split('?')[0];

    if (
      request.method === 'OPTIONS' ||
      path.startsWith('/auth/') ||
      path.startsWith('/actuator/')
    ) {
      return true;
    }

    if (!path.startsWith('/api/')) {
      return true;
    }

    const rawAuthHeader = request.headers.authorization;
    const authHeader = Array.isArray(rawAuthHeader) ? rawAuthHeader[0] : rawAuthHeader;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new GatewayUnauthorizedError('Missing or invalid Authorization header');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; role: string }>(
        authHeader.slice('Bearer '.length),
      );
      request.headers['x-auth-username'] = payload.sub;
      request.headers['x-auth-role'] = payload.role;
      return true;
    } catch {
      throw new GatewayUnauthorizedError('Invalid or expired token');
    }
  }
}
