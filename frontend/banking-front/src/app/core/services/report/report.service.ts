import { HttpClient, HttpParams } from '@angular/common/http';
import { DOCUMENT, inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  PagedResponse,
  ReportApiResponse,
  ReportParams,
  ReportPdfResponse,
  ReportRow,
} from '@core/interface';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly baseUrl = `${environment.API_URL}/api/reportes`;

  getReport(params: ReportParams) {
    let httpParams = new HttpParams()
      .set('fechaInicio', params.fechaInicio)
      .set('fechaFin', params.fechaFin);
    if (params.cliente) httpParams = httpParams.set('cliente', params.cliente);
    if (params.page != null) httpParams = httpParams.set('page', params.page);
    if (params.size != null) httpParams = httpParams.set('size', params.size);
    return this.http
      .get<ReportApiResponse>(this.baseUrl, {
        params: httpParams,
      })
      .pipe(map((response) => this.normalizeReportResponse(response, params)));
  }

  getReportPdf(params: ReportParams) {
    let httpParams = new HttpParams()
      .set('fechaInicio', params.fechaInicio)
      .set('fechaFin', params.fechaFin);
    if (params.cliente) httpParams = httpParams.set('cliente', params.cliente);
    return this.http
      .get<ReportPdfResponse>(`${this.baseUrl}/pdf`, {
        params: httpParams,
      })
      .pipe(tap((res) => this.downloadReportPdf(res)));
  }

  downloadReportPdf(res: ReportPdfResponse) {
    const report = res.reporte ?? res.base64;
    const link = this.document.createElement('a');
    link.href = `data:application/pdf;base64,${report ?? ''}`;
    link.download = 'reporte.pdf';
    link.click();
    link.remove();
  }

  private normalizeReportResponse(
    response: ReportApiResponse,
    params: ReportParams,
  ): PagedResponse<ReportRow> {
    if (!Array.isArray(response)) {
      return response;
    }

    return {
      content: response,
      page: params.page ?? 1,
      size: params.size ?? response.length,
      totalElements: response.length,
      totalPages: 1,
      first: true,
      last: true,
    };
  }
}
