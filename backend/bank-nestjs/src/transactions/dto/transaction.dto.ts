import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, Matches, Min } from 'class-validator';

export class TransactionRequestDto {
  @IsDefined({ message: 'Account number is required' })
  @IsString()
  @Matches(/\S/, { message: 'Account number is required' })
  numeroCuenta: string;

  @IsDefined({ message: 'Transaction type is required' })
  @IsString()
  @Matches(/\S/, { message: 'Transaction type is required' })
  tipoMovimiento: string;

  @IsDefined({ message: 'Amount is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Amount is required' })
  @Min(0.01, { message: 'Amount must be positive' })
  valor: number;
}

export interface TransactionResponseDto {
  id: number;
  fecha: string;
  tipoMovimiento: string;
  valor: number;
  saldo: number;
  numeroCuenta: string;
}
