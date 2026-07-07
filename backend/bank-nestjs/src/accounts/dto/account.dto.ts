import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNumber, IsString, Matches, Min } from 'class-validator';

export class AccountRequestDto {
  @IsDefined({ message: 'Account number is required' })
  @IsString()
  @Matches(/\S/, { message: 'Account number is required' })
  numeroCuenta: string;

  @IsDefined({ message: 'Account type is required' })
  @IsString()
  @Matches(/\S/, { message: 'Account type is required' })
  tipoCuenta: string;

  @IsDefined({ message: 'Initial balance is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Initial balance is required' })
  @Min(0, { message: 'Initial balance cannot be negative' })
  saldoInicial: number;

  @IsDefined({ message: 'Status is required' })
  @IsBoolean({ message: 'Status is required' })
  estado: boolean;

  @IsDefined({ message: 'Client ID is required' })
  @IsString()
  @Matches(/\S/, { message: 'Client ID is required' })
  clienteId: string;
}

export interface AccountResponseDto {
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  estado: boolean;
  clienteId: string;
  cliente: string;
}
