import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { Account, AuthUser, Client, Transaction } from './entities';

const SEEDED_STANDARD_USERS = 100;
const SEEDED_CLIENTS = 100;
const SEEDED_ACCOUNTS_PER_TYPE = 100;
const SEEDED_TRANSACTIONS_PER_TYPE = 100;

@Injectable()
export class InMemoryStore implements OnModuleInit {
  users: AuthUser[] = [];
  clients: Client[] = [];
  accounts: Account[] = [];
  transactions: Transaction[] = [];

  private userSeq = 1;
  private clientSeq = 1;
  private accountSeq = 1;
  private transactionSeq = 1;

  onModuleInit() {
    this.reset();
  }

  reset() {
    this.users = [];
    this.clients = [];
    this.accounts = [];
    this.transactions = [];
    this.userSeq = 1;
    this.clientSeq = 1;
    this.accountSeq = 1;
    this.transactionSeq = 1;

    this.seedUsers();
    this.seedBankingData();
  }

  nextUserId() {
    return this.userSeq++;
  }

  nextClientId() {
    return this.clientSeq++;
  }

  nextAccountId() {
    return this.accountSeq++;
  }

  nextTransactionId() {
    return this.transactionSeq++;
  }

  createClientId() {
    return randomUUID();
  }

  hashPassword(rawPassword: string): string {
    const salt = randomUUID().replace(/-/g, '');
    const hash = scryptSync(rawPassword, salt, 32).toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(rawPassword: string, stored: string): boolean {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;

    const candidate = Buffer.from(scryptSync(rawPassword, salt, 32).toString('hex'));
    const expected = Buffer.from(hash);
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  }

  private seedUsers() {
    this.addSeedUser({
      username: 'admin',
      password: 'admin123',
      role: 'ADMIN',
      enabled: true,
    });

    const demoPasswordHash = this.hashPassword('demo123');
    for (let index = 1; index <= SEEDED_STANDARD_USERS; index++) {
      this.addSeedUser({
        username: `user${padNumber(index, 3)}`,
        passwordHash: demoPasswordHash,
        role: 'USER',
        enabled: index % 10 !== 0,
      });
    }
  }

  private seedBankingData() {
    const jose = this.addSeedClient({
      clienteId: 'client-001',
      nombre: 'Jose Lema',
      genero: 'MASCULINO',
      edad: 35,
      identificacion: '1234567890',
      direccion: 'Otavalo sn y principal',
      telefono: '098254785',
      contrasena: '1234',
      estado: true,
    });

    const marianela = this.addSeedClient({
      clienteId: 'client-002',
      nombre: 'Marianela Montalvo',
      genero: 'FEMENINO',
      edad: 30,
      identificacion: '0987654321',
      direccion: 'Amazonas 456 y Colon',
      telefono: '097548965',
      contrasena: '5678',
      estado: true,
    });

    const ahorroJose = this.addSeedAccount('478758', 'AHORRO', 2000, true, jose.id);
    const corrienteJose = this.addSeedAccount('225487', 'CORRIENTE', 100, true, jose.id);
    this.addSeedAccount('495878', 'AHORRO', 0, true, marianela.id);
    this.addSeedAccount('496825', 'AHORRO', 540, true, marianela.id);

    this.addSeedTransaction(daysAgo(5), 'CREDITO', 500, 2500, ahorroJose.id);
    this.addSeedTransaction(daysAgo(3), 'DEBITO', -40, 60, corrienteJose.id);
    this.addSeedTransaction(daysAgo(1), 'DEBITO', -100, 2400, ahorroJose.id);

    this.seedAdditionalClients();
    this.seedAdditionalAccounts('AHORRO', '7', 950);
    this.seedAdditionalAccounts('CORRIENTE', '8', 1200);
    this.seedAdditionalTransactions();
  }

  private addSeedUser(input: {
    username: string;
    role: AuthUser['role'];
    enabled: boolean;
    password?: string;
    passwordHash?: string;
  }): AuthUser {
    const user: AuthUser = {
      id: this.nextUserId(),
      username: input.username,
      passwordHash: input.passwordHash ?? this.hashPassword(input.password ?? 'demo123'),
      role: input.role,
      enabled: input.enabled,
    };
    this.users.push(user);
    return user;
  }

  private seedAdditionalClients() {
    const demoClientPasswordHash = this.hashPassword('demo123');
    let index = this.clients.length + 1;

    while (this.clients.length < SEEDED_CLIENTS) {
      const padded = padNumber(index, 3);
      this.addSeedClient({
        clienteId: `client-${padded}`,
        nombre: `ZZ Cliente Demo ${padded}`,
        genero: index % 2 === 0 ? 'FEMENINO' : 'MASCULINO',
        edad: 18 + (index % 53),
        identificacion: `9000000${padNumber(index, 3)}`,
        direccion: `Av Demo ${padded} y Calle ${padNumber((index % 90) + 1, 2)}`,
        telefono: `099${padNumber(index, 7)}`,
        contrasenaHash: demoClientPasswordHash,
        estado: index % 12 !== 0,
      });
      index++;
    }
  }

  private seedAdditionalAccounts(
    tipoCuenta: Account['tipoCuenta'],
    prefix: string,
    baseBalance: number,
  ) {
    let index = 1;

    while (this.countAccountsByType(tipoCuenta) < SEEDED_ACCOUNTS_PER_TYPE) {
      const client = this.clients[(index + (tipoCuenta === 'AHORRO' ? 0 : 17)) % this.clients.length];
      this.addSeedAccount(
        `${prefix}${padNumber(index, 5)}`,
        tipoCuenta,
        roundSeedMoney(baseBalance + ((index * 37) % 2600) + (index % 4) * 0.25),
        index % 15 !== 0,
        client.id,
      );
      index++;
    }
  }

  private seedAdditionalTransactions() {
    const balances = new Map<number, number>();
    for (const account of this.accounts) {
      balances.set(account.id, account.saldoInicial);
    }
    for (const transaction of this.transactions) {
      balances.set(
        transaction.cuentaId,
        roundSeedMoney((balances.get(transaction.cuentaId) ?? 0) + transaction.valor),
      );
    }

    this.seedTransactionsByType('CREDITO', balances);
    this.seedTransactionsByType('DEBITO', balances);
  }

  private seedTransactionsByType(
    tipoMovimiento: Transaction['tipoMovimiento'],
    balances: Map<number, number>,
  ) {
    const accounts = this.accounts.filter((account) => account.estado && account.saldoInicial >= 500);
    let index = 1;

    while (this.countTransactionsByType(tipoMovimiento) < SEEDED_TRANSACTIONS_PER_TYPE) {
      const account = accounts[(index + (tipoMovimiento === 'CREDITO' ? 0 : 29)) % accounts.length];
      const currentBalance = balances.get(account.id) ?? account.saldoInicial;
      const rawAmount =
        tipoMovimiento === 'CREDITO'
          ? 25 + ((index * 19) % 975)
          : 5 + ((index * 13) % 145);
      const signedAmount =
        tipoMovimiento === 'CREDITO'
          ? roundSeedMoney(rawAmount)
          : -roundSeedMoney(Math.min(rawAmount, Math.max(currentBalance - 10, 1)));
      const newBalance = roundSeedMoney(currentBalance + signedAmount);

      this.addSeedTransaction(
        daysAgo(6 + ((index + (tipoMovimiento === 'CREDITO' ? 0 : 45)) % 180)),
        tipoMovimiento,
        signedAmount,
        newBalance,
        account.id,
      );
      balances.set(account.id, newBalance);
      index++;
    }
  }

  private countAccountsByType(tipoCuenta: Account['tipoCuenta']): number {
    return this.accounts.filter((account) => account.tipoCuenta === tipoCuenta).length;
  }

  private countTransactionsByType(tipoMovimiento: Transaction['tipoMovimiento']): number {
    return this.transactions.filter(
      (transaction) => transaction.tipoMovimiento === tipoMovimiento,
    ).length;
  }

  private addSeedClient(input: {
    clienteId: string;
    nombre: string;
    genero: string;
    edad: number;
    identificacion: string;
    direccion: string;
    telefono: string;
    contrasena?: string;
    contrasenaHash?: string;
    estado: boolean;
  }): Client {
    const client: Client = {
      id: this.nextClientId(),
      clienteId: input.clienteId,
      nombre: input.nombre,
      genero: input.genero,
      edad: input.edad,
      identificacion: input.identificacion,
      direccion: input.direccion,
      telefono: input.telefono,
      contrasenaHash: input.contrasenaHash ?? this.hashPassword(input.contrasena ?? 'demo123'),
      estado: input.estado,
    };
    this.clients.push(client);
    return client;
  }

  private addSeedAccount(
    numeroCuenta: string,
    tipoCuenta: Account['tipoCuenta'],
    saldoInicial: number,
    estado: boolean,
    clienteId: number,
  ): Account {
    const account: Account = {
      id: this.nextAccountId(),
      numeroCuenta,
      tipoCuenta,
      saldoInicial,
      estado,
      clienteId,
    };
    this.accounts.push(account);
    return account;
  }

  private addSeedTransaction(
    fecha: string,
    tipoMovimiento: Transaction['tipoMovimiento'],
    valor: number,
    saldo: number,
    cuentaId: number,
  ) {
    this.transactions.push({
      id: this.nextTransactionId(),
      fecha,
      tipoMovimiento,
      valor,
      saldo,
      cuentaId,
    });
  }
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function padNumber(value: number, size: number): string {
  return String(value).padStart(size, '0');
}

function roundSeedMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
