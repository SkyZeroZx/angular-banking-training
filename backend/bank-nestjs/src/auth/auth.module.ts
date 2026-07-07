import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  DEFAULT_JWT_EXPIRATION_MS,
  DEFAULT_JWT_SECRET,
} from '../common/constants';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const expirationMs = Number(process.env.JWT_EXPIRATION_MS ?? DEFAULT_JWT_EXPIRATION_MS);

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET,
      signOptions: {
        expiresIn: Math.floor(expirationMs / 1000),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
