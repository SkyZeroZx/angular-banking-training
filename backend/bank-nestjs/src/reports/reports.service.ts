import { Injectable } from '@nestjs/common';
import { badRequest } from '../common/domain-error';
import { PageQuery, PagedResponse, parsePageable, sortAndPaginate } from '../common/pagination';
import { formatReportDate } from '../common/text';
import { Transaction } from '../database/entities';
import { InMemoryStore } from '../database/in-memory.store';
import { ReportPdfResponseDto, ReportResponseDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly store: InMemoryStore) {}

  generateJsonReport(
    clienteId: string | undefined,
    fechaInicio: string | undefined,
    fechaFin: string | undefined,
    query: PageQuery,
  ): PagedResponse<ReportResponseDto> {
    const range = this.parseRange(fechaInicio, fechaFin);
    const pageable = parsePageable(query, 'fecha', 'desc');
    const rows = this.findReportTransactions(clienteId, range.start, range.end);
    const page = sortAndPaginate(rows, pageable, (transaction, field) =>
      field in transaction ? transaction[field as keyof Transaction] : '',
    );

    return {
      ...page,
      content: page.content.map((transaction) => this.toReportRow(transaction)),
    };
  }

  generatePdfReportBase64(
    clienteId: string | undefined,
    fechaInicio: string | undefined,
    fechaFin: string | undefined,
  ): ReportPdfResponseDto {
    const range = this.parseRange(fechaInicio, fechaFin);
    const rows = this.findReportTransactions(clienteId, range.start, range.end).map((transaction) =>
      this.toReportRow(transaction),
    );
    const clientLabel = clienteId ? rows[0]?.cliente ?? clienteId : 'Todos los clientes';
    const text = [
      'Estado de Cuenta',
      `Cliente: ${clientLabel}`,
      `Periodo: ${fechaInicio} - ${fechaFin}`,
      ...rows.map(
        (row) =>
          `${row.fecha} | ${row.cliente} | ${row.numeroCuenta} | ${row.movimiento} | ${row.saldoDisponible}`,
      ),
    ].join('\n');

    return { reporte: Buffer.from(text, 'utf8').toString('base64') };
  }

  private findReportTransactions(clienteId: string | undefined, start: number, end: number) {
    return this.store.transactions.filter((transaction) => {
      const account = this.store.accounts.find((item) => item.id === transaction.cuentaId);
      const client = this.store.clients.find((item) => item.id === account?.clienteId);
      const time = new Date(transaction.fecha).getTime();
      return (
        time >= start &&
        time <= end &&
        (!clienteId || client?.clienteId === clienteId)
      );
    });
  }

  private toReportRow(transaction: Transaction): ReportResponseDto {
    const account = this.store.accounts.find((item) => item.id === transaction.cuentaId);
    const client = this.store.clients.find((item) => item.id === account?.clienteId);

    return {
      fecha: formatReportDate(transaction.fecha),
      cliente: client?.nombre ?? '',
      numeroCuenta: account?.numeroCuenta ?? '',
      tipo: account?.tipoCuenta === 'AHORRO' ? 'Ahorros' : 'Corriente',
      saldoInicial: account?.saldoInicial ?? 0,
      estado: account?.estado ?? false,
      movimiento: transaction.valor,
      saldoDisponible: transaction.saldo,
    };
  }

  private parseRange(fechaInicio: string | undefined, fechaFin: string | undefined) {
    if (!fechaInicio) throw badRequest("Required parameter 'fechaInicio' is missing");
    if (!fechaFin) throw badRequest("Required parameter 'fechaFin' is missing");

    const start = new Date(`${fechaInicio}T00:00:00.000`).getTime();
    const end = new Date(`${fechaFin}T23:59:59.999`).getTime();

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      throw badRequest('Invalid date range');
    }

    return { start, end };
  }
}
