import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PageQuery, PagedResponse } from '../common/pagination';
import { AccountRequestDto, AccountResponseDto } from './dto/account.dto';
import { AccountsService } from './accounts.service';

@Controller('api/cuentas')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  listAll(@Query() query: PageQuery): PagedResponse<AccountResponseDto> {
    return this.accountsService.findAll(query);
  }

  @Get(':numeroCuenta')
  getByAccountNumber(@Param('numeroCuenta') numeroCuenta: string): AccountResponseDto {
    return this.accountsService.findByAccountNumber(numeroCuenta);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() request: AccountRequestDto): AccountResponseDto {
    return this.accountsService.create(request);
  }

  @Put(':numeroCuenta')
  update(
    @Param('numeroCuenta') numeroCuenta: string,
    @Body() request: AccountRequestDto,
  ): AccountResponseDto {
    return this.accountsService.update(numeroCuenta, request);
  }

  @Patch(':numeroCuenta')
  partialUpdate(
    @Param('numeroCuenta') numeroCuenta: string,
    @Body() request: Partial<AccountRequestDto>,
  ): AccountResponseDto {
    return this.accountsService.partialUpdate(numeroCuenta, request);
  }

  @Delete(':numeroCuenta')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('numeroCuenta') numeroCuenta: string): void {
    this.accountsService.delete(numeroCuenta);
  }
}
