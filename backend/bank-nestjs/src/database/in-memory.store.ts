import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { Account, AuthUser, Client, Transaction } from './entities';

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
    this.users.push({
      id: this.nextUserId(),
      username: 'admin',
      passwordHash: this.hashPassword('admin123'),
      role: 'ADMIN',
      enabled: true,
    });
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
  }

  private addSeedClient(input: {
    clienteId: string;
    nombre: string;
    genero: string;
    edad: number;
    identificacion: string;
    direccion: string;
    telefono: string;
    contrasena: string;
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
      contrasenaHash: this.hashPassword(input.contrasena),
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
