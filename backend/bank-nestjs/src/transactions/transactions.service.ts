import { Injectable } from '@nestjs/common';
import { AccountsService, roundMoney } from '../accounts/accounts.service';
import {
  DEFAULT_DAILY_WITHDRAWAL_LIMIT,
} from '../common/constants';
import { badRequest, notFound } from '../common/domain-error';
import { PageQuery, PagedResponse, parsePageable, sortAndPaginate } from '../common/pagination';
import { includesIgnoreCase, normalize } from '../common/text';
import { Transaction, TransactionType } from '../database/entities';
import { InMemoryStore } from '../database/in-memory.store';
import { TransactionRequestDto, TransactionResponseDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  private readonly dailyWithdrawalLimit = Number(
    process.env.DAILY_WITHDRAWAL_LIMIT ?? DEFAULT_DAILY_WITHDRAWAL_LIMIT,
  );

  constructor(
    private readonly store: InMemoryStore,
    private readonly accountsService: AccountsService,
  ) {}

  findAll(query: PageQuery): PagedResponse<TransactionResponseDto> {
    const pageable = parsePageable(query, 'fecha', 'desc');
    const search = query.search?.trim() ?? '';
    const filtered = search
      ? this.store.transactions.filter((transaction) => {
          const account = this.store.accounts.find((item) => item.id === transaction.cuentaId);
          return (
            includesIgnoreCase(account?.numeroCuenta, search) ||
            includesIgnoreCase(transaction.tipoMovimiento, search)
          );
        })
      : this.store.transactions;

    const page = sortAndPaginate(filtered, pageable, (transaction, field) =>
      field in transaction ? transaction[field as keyof Transaction] : '',
    );

    return {
      ...page,
      content: page.content.map((transaction) => this.toResponse(transaction)),
    };
  }

  findById(id: number): TransactionResponseDto {
    return this.toResponse(this.findEntityById(id));
  }

  register(request: TransactionRequestDto): TransactionResponseDto {
    const account = this.accountsService.findEntityByAccountNumber(request.numeroCuenta);
    const type = this.parseTransactionType(request.tipoMovimiento);
    const currentBalance = this.accountsService.calculateCurrentBalance(account);

    let amount = request.valor;
    if (type === 'DEBITO') {
      if (currentBalance < request.valor) {
        throw badRequest('Saldo no disponible');
      }
      this.validateDailyLimit(account.clienteId, request.valor);
      amount = -request.valor;
    }

    const transaction: Transaction = {
      id: this.store.nextTransactionId(),
      fecha: new Date().toISOString(),
      tipoMovimiento: type,
      valor: roundMoney(amount),
      saldo: roundMoney(currentBalance + amount),
      cuentaId: account.id,
    };
    this.store.transactions.push(transaction);

    return this.toResponse(transaction);
  }

  delete(id: number): void {
    const transaction = this.findEntityById(id);
    this.store.transactions = this.store.transactions.filter((item) => item.id !== transaction.id);
  }

  findEntityById(id: number): Transaction {
    const transaction = this.store.transactions.find((item) => item.id === id);
    if (!transaction) throw notFound('Transaction', 'id', id);
    return transaction;
  }

  toResponse(transaction: Transaction): TransactionResponseDto {
    const account = this.store.accounts.find((item) => item.id === transaction.cuentaId);
    return {
      id: transaction.id,
      fecha: transaction.fecha,
      tipoMovimiento: this.formatTransactionType(transaction.tipoMovimiento),
      valor: transaction.valor,
      saldo: transaction.saldo,
      numeroCuenta: account?.numeroCuenta ?? '',
    };
  }

  private parseTransactionType(value: string): TransactionType {
    const normalized = normalize(value);
    if (normalized === 'CREDITO' || normalized === 'DEPOSITO') return 'CREDITO';
    if (normalized === 'DEBITO' || normalized === 'RETIRO') return 'DEBITO';
    throw badRequest(`Invalid transaction type: ${value}`);
  }

  private formatTransactionType(type: TransactionType): string {
    return type === 'CREDITO' ? 'Cr\u00e9dito' : 'D\u00e9bito';
  }

  private validateDailyLimit(clientInternalId: number, withdrawalAmount: number) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    const withdrawalsToday = this.store.transactions
      .filter((transaction) => {
        const account = this.store.accounts.find((item) => item.id === transaction.cuentaId);
        const time = new Date(transaction.fecha).getTime();
        return (
          account?.clienteId === clientInternalId &&
          transaction.tipoMovimiento === 'DEBITO' &&
          time >= start &&
          time <= end
        );
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.valor), 0);

    if (withdrawalsToday + withdrawalAmount > this.dailyWithdrawalLimit) {
      throw badRequest('Cupo diario Excedido');
    }
  }
}
