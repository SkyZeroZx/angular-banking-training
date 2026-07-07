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
import { ClientsService } from './clients.service';
import { ClientRequestDto, ClientResponseDto } from './dto/client.dto';

@Controller('api/clientes')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  listAll(@Query() query: PageQuery): PagedResponse<ClientResponseDto> {
    return this.clientsService.findAll(query);
  }

  @Get(':clienteId')
  getById(@Param('clienteId') clienteId: string): ClientResponseDto {
    return this.clientsService.findByClienteId(clienteId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() request: ClientRequestDto): ClientResponseDto {
    return this.clientsService.create(request);
  }

  @Put(':clienteId')
  update(
    @Param('clienteId') clienteId: string,
    @Body() request: ClientRequestDto,
  ): ClientResponseDto {
    return this.clientsService.update(clienteId, request);
  }

  @Patch(':clienteId')
  partialUpdate(
    @Param('clienteId') clienteId: string,
    @Body() request: Partial<ClientRequestDto>,
  ): ClientResponseDto {
    return this.clientsService.partialUpdate(clienteId, request);
  }

  @Delete(':clienteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('clienteId') clienteId: string): void {
    this.clientsService.delete(clienteId);
  }
}
