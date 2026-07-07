import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { badRequest, DomainHttpError } from '../common/domain-error';
import { InMemoryStore } from '../database/in-memory.store';
import {
  AuthRequestDto,
  AuthResponseDto,
  TokenValidationResponseDto,
} from './dto/auth-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly store: InMemoryStore,
    private readonly jwtService: JwtService,
  ) {}

  login(request: AuthRequestDto): AuthResponseDto {
    const user = this.store.users.find((item) => item.username === request.username);

    if (!user || !this.store.verifyPassword(request.password, user.passwordHash)) {
      throw new DomainHttpError(401, 'Unauthorized', 'Invalid username or password');
    }

    if (!user.enabled) {
      throw new DomainHttpError(403, 'Forbidden', 'Account is disabled');
    }

    return this.buildAuthResponse(user.username, user.role);
  }

  register(request: AuthRequestDto): AuthResponseDto {
    const exists = this.store.users.some((item) => item.username === request.username);
    if (exists) {
      throw badRequest(`Username already exists: ${request.username}`);
    }

    const user = {
      id: this.store.nextUserId(),
      username: request.username,
      passwordHash: this.store.hashPassword(request.password),
      role: 'USER' as const,
      enabled: true,
    };
    this.store.users.push(user);

    return this.buildAuthResponse(user.username, user.role);
  }

  validateToken(token: string | undefined): TokenValidationResponseDto {
    if (!token) {
      throw badRequest("Required parameter 'token' is missing");
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; role: string }>(token);
      return {
        valid: true,
        username: payload.sub,
        role: payload.role,
      };
    } catch {
      return { valid: false };
    }
  }

  private buildAuthResponse(username: string, role: string): AuthResponseDto {
    return {
      token: this.jwtService.sign({ role }, { subject: username }),
      username,
      role,
    };
  }
}
