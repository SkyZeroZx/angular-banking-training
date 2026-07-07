import { Controller, Get, Query } from '@nestjs/common';
import { PageQuery, PagedResponse } from '../common/pagination';
import { ReportPdfResponseDto, ReportResponseDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@Controller('api/reportes')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getJsonReport(
    @Query('cliente') cliente: string | undefined,
    @Query('fechaInicio') fechaInicio: string | undefined,
    @Query('fechaFin') fechaFin: string | undefined,
    @Query() query: PageQuery,
  ): PagedResponse<ReportResponseDto> {
    return this.reportsService.generateJsonReport(cliente, fechaInicio, fechaFin, query);
  }

  @Get('pdf')
  getPdfReport(
    @Query('cliente') cliente: string | undefined,
    @Query('fechaInicio') fechaInicio: string | undefined,
    @Query('fechaFin') fechaFin: string | undefined,
  ): ReportPdfResponseDto {
    return this.reportsService.generatePdfReportBase64(cliente, fechaInicio, fechaFin);
  }
}
