export type Role = 'USER' | 'ADMIN';
export type AccountType = 'AHORRO' | 'CORRIENTE';
export type TransactionType = 'CREDITO' | 'DEBITO';

export interface AuthUser {
  id: number;
  username: string;
  passwordHash: string;
  role: Role;
  enabled: boolean;
}

export interface Client {
  id: number;
  clienteId: string;
  nombre: string;
  genero: string;
  edad: number;
  identificacion: string;
  direccion: string;
  telefono: string;
  contrasenaHash: string;
  estado: boolean;
}

export interface Account {
  id: number;
  numeroCuenta: string;
  tipoCuenta: AccountType;
  saldoInicial: number;
  estado: boolean;
  clienteId: number;
}

export interface Transaction {
  id: number;
  fecha: string;
  tipoMovimiento: TransactionType;
  valor: number;
  saldo: number;
  cuentaId: number;
}
