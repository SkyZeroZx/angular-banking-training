import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { FeatureHeaderInterceptor } from './auth/feature-header.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ClientsModule } from './clients/clients.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { ReportsModule } from './reports/reports.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ClientsModule,
    AccountsModule,
    TransactionsModule,
    ReportsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FeatureHeaderInterceptor,
    },
  ],
})
export class AppModule {}
