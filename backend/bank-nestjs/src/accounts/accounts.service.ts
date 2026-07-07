import { Injectable } from '@nestjs/common';
import { badRequest, conflict, notFound } from '../common/domain-error';
import { PageQuery, PagedResponse, parsePageable, sortAndPaginate } from '../common/pagination';
import { includesIgnoreCase, normalize } from '../common/text';
import { ClientsService } from '../clients/clients.service';
import { Account, AccountType } from '../database/entities';
import { InMemoryStore } from '../database/in-memory.store';
import { AccountRequestDto, AccountResponseDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private readonly store: InMemoryStore,
    private readonly clientsService: ClientsService,
  ) {}

  findAll(query: PageQuery): PagedResponse<AccountResponseDto> {
    const pageable = parsePageable(query, 'id', 'asc');
    const search = query.search?.trim() ?? '';
    const filtered = search
      ? this.store.accounts.filter((account) => {
          const client = this.findClientByInternalId(account.clienteId);
          return (
            includesIgnoreCase(account.numeroCuenta, search) ||
            includesIgnoreCase(client?.nombre, search)
          );
        })
      : this.store.accounts;

    const page = sortAndPaginate(filtered, pageable, (account, field) => {
      if (field === 'cliente') return this.findClientByInternalId(account.clienteId)?.nombre;
      return field in account ? account[field as keyof Account] : '';
    });

    return {
      ...page,
      content: page.content.map((account) => this.toResponse(account)),
    };
  }

  findByAccountNumber(numeroCuenta: string): AccountResponseDto {
    return this.toResponse(this.findEntityByAccountNumber(numeroCuenta));
  }

  create(request: AccountRequestDto): AccountResponseDto {
    this.assertUniqueAccountNumber(request.numeroCuenta);
    const client = this.clientsService.findEntityByClienteId(request.clienteId);

    const account: Account = {
      id: this.store.nextAccountId(),
      numeroCuenta: request.numeroCuenta,
      tipoCuenta: this.parseAccountType(request.tipoCuenta),
      saldoInicial: request.saldoInicial,
      estado: request.estado,
      clienteId: client.id,
    };
    this.store.accounts.push(account);
    return this.toResponse(account);
  }

  update(numeroCuenta: string, request: AccountRequestDto): AccountResponseDto {
    const account = this.findEntityByAccountNumber(numeroCuenta);
    this.assertUniqueAccountNumber(request.numeroCuenta, account.id);
    const client = this.clientsService.findEntityByClienteId(request.clienteId);

    account.numeroCuenta = request.numeroCuenta;
    account.tipoCuenta = this.parseAccountType(request.tipoCuenta);
    account.saldoInicial = request.saldoInicial;
    account.estado = request.estado;
    account.clienteId = client.id;

    return this.toResponse(account);
  }

  partialUpdate(numeroCuenta: string, request: Partial<AccountRequestDto>): AccountResponseDto {
    const account = this.findEntityByAccountNumber(numeroCuenta);

    if (request.numeroCuenta !== undefined) {
      this.assertUniqueAccountNumber(request.numeroCuenta, account.id);
      account.numeroCuenta = request.numeroCuenta;
    }
    if (request.tipoCuenta !== undefined) account.tipoCuenta = this.parseAccountType(request.tipoCuenta);
    if (request.saldoInicial !== undefined) account.saldoInicial = Number(request.saldoInicial);
    if (request.estado !== undefined) account.estado = request.estado;
    if (request.clienteId !== undefined) {
      account.clienteId = this.clientsService.findEntityByClienteId(request.clienteId).id;
    }

    return this.toResponse(account);
  }

  delete(numeroCuenta: string): void {
    const account = this.findEntityByAccountNumber(numeroCuenta);
    this.store.transactions = this.store.transactions.filter(
      (transaction) => transaction.cuentaId !== account.id,
    );
    this.store.accounts = this.store.accounts.filter((item) => item.id !== account.id);
  }

  findEntityByAccountNumber(numeroCuenta: string): Account {
    const account = this.store.accounts.find((item) => item.numeroCuenta === numeroCuenta);
    if (!account) throw notFound('Account', 'numeroCuenta', numeroCuenta);
    return account;
  }

  calculateCurrentBalance(account: Account): number {
    const movements = this.store.transactions
      .filter((transaction) => transaction.cuentaId === account.id)
      .reduce((sum, transaction) => sum + transaction.valor, 0);
    return roundMoney(account.saldoInicial + movements);
  }

  toResponse(account: Account): AccountResponseDto {
    const client = this.findClientByInternalId(account.clienteId);
    return {
      numeroCuenta: account.numeroCuenta,
      tipoCuenta: account.tipoCuenta,
      saldoInicial: account.saldoInicial,
      estado: account.estado,
      clienteId: client?.clienteId ?? '',
      cliente: client?.nombre ?? '',
    };
  }

  private parseAccountType(value: string): AccountType {
    const normalized = normalize(value);
    if (normalized === 'AHORRO' || normalized === 'AHORROS') return 'AHORRO';
    if (normalized === 'CORRIENTE') return 'CORRIENTE';
    throw badRequest(`Invalid account type: ${value}`);
  }

  private assertUniqueAccountNumber(numeroCuenta: string, currentId?: number) {
    const duplicate = this.store.accounts.some(
      (account) => account.numeroCuenta === numeroCuenta && account.id !== currentId,
    );
    if (duplicate) {
      throw conflict('Account number already exists');
    }
  }

  private findClientByInternalId(id: number) {
    return this.store.clients.find((client) => client.id === id);
  }
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
