import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ClientRequestDto {
  @IsDefined({ message: 'Name is required' })
  @IsString()
  @Matches(/\S/, { message: 'Name is required' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  nombre: string;

  @IsDefined({ message: 'Gender is required' })
  @IsString()
  @Matches(/\S/, { message: 'Gender is required' })
  genero: string;

  @IsDefined({ message: 'Age is required' })
  @Type(() => Number)
  @IsInt({ message: 'Age must be a positive number' })
  @Min(1, { message: 'Age must be a positive number' })
  edad: number;

  @IsDefined({ message: 'Identification is required' })
  @IsString()
  @Matches(/\S/, { message: 'Identification is required' })
  @MaxLength(20, { message: 'Identification cannot exceed 20 characters' })
  identificacion: string;

  @IsDefined({ message: 'Address is required' })
  @IsString()
  @Matches(/\S/, { message: 'Address is required' })
  direccion: string;

  @IsDefined({ message: 'Phone is required' })
  @IsString()
  @Matches(/\S/, { message: 'Phone is required' })
  telefono: string;

  @IsDefined({ message: 'Password is required' })
  @IsString()
  @Matches(/\S/, { message: 'Password is required' })
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  contrasena: string;

  @IsDefined({ message: 'Status is required' })
  @IsBoolean({ message: 'Status is required' })
  estado: boolean;
}

export interface ClientResponseDto {
  clienteId: string;
  nombre: string;
  genero: string;
  edad: number;
  identificacion: string;
  direccion: string;
  telefono: string;
  estado: boolean;
}
