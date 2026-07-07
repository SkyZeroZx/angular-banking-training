import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { DatabaseModule } from '../database/database.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [DatabaseModule, AccountsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
