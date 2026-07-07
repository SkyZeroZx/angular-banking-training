import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PageQuery, PagedResponse } from '../common/pagination';
import { TransactionRequestDto, TransactionResponseDto } from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('api/movimientos')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  listAll(@Query() query: PageQuery): PagedResponse<TransactionResponseDto> {
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): TransactionResponseDto {
    return this.transactionsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(@Body() request: TransactionRequestDto): TransactionResponseDto {
    return this.transactionsService.register(request);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): void {
    this.transactionsService.delete(id);
  }
}
