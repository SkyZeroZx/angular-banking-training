import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthRequestDto,
  AuthResponseDto,
  TokenValidationResponseDto,
} from './dto/auth-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() request: AuthRequestDto): AuthResponseDto {
    return this.authService.login(request);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() request: AuthRequestDto): AuthResponseDto {
    return this.authService.register(request);
  }

  @Get('validate')
  validate(@Query('token') token?: string): TokenValidationResponseDto {
    return this.authService.validateToken(token);
  }
}
