import { ReportParams, ReportRow } from '@core/interface';
import { HttpTestingController } from '@angular/common/http/testing';
import {
  expectMissingParams,
  expectParams,
  expectRequest,
  pagedResponse,
  setupHttpService,
} from '@app/spec-helpers/http.spec-helper';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  const row: ReportRow = {
    fecha: '2024-01-15',
    cliente: 'Juan Perez',
    numeroCuenta: '123456',
    tipo: 'AHORRO',
    saldoInicial: 1000,
    estado: true,
    movimiento: 200,
    saldoDisponible: 1200,
  };

  const requiredParams: ReportParams = {
    fechaInicio: '2024-01-01',
    fechaFin: '2024-01-31',
  };

  beforeEach(() => {
    ({ service, http: httpMock } = setupHttpService(ReportService));
  });

  afterEach(() => httpMock.verify());

  describe('getReport', () => {
    it('calls GET /api/reportes with required date params', () => {
      service.getReport(requiredParams).subscribe((response) => {
        expect(response.content).toEqual([row]);
      });

      const req = expectRequest(httpMock, '/api/reportes', 'GET');
      expectParams(req, {
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-31',
      });
      req.flush(pagedResponse([row]));
    });

    it('sends optional pagination and client params', () => {
      service
        .getReport({
          ...requiredParams,
          cliente: 'client-001',
          page: 0,
          size: 10,
        })
        .subscribe();

      const req = expectRequest(httpMock, '/api/reportes', 'GET');
      expectParams(req, {
        cliente: 'client-001',
        page: '0',
        size: '10',
      });
      req.flush(pagedResponse([row], { page: 0, size: 10 }));
    });

    it('omits empty optional params', () => {
      service.getReport({ ...requiredParams, cliente: undefined }).subscribe();

      const req = expectRequest(httpMock, '/api/reportes', 'GET');
      expectMissingParams(req, ['cliente', 'page', 'size']);
      req.flush(pagedResponse([row]));
    });

    it('normalizes legacy array responses to a paged response', () => {
      service.getReport(requiredParams).subscribe((response) => {
        expect(response.content).toEqual([row]);
        expect(response.totalElements).toBe(1);
        expect(response.first).toBe(true);
        expect(response.last).toBe(true);
      });

      const req = expectRequest(httpMock, '/api/reportes', 'GET');
      req.flush([row]);
    });
  });

  describe('getReportPdf', () => {
    it('calls GET /api/reportes/pdf and accepts reporte payload', () => {
      service
        .getReportPdf(requiredParams)
        .subscribe((response) => expect(response.reporte).toBe('abc123'));

      const req = expectRequest(httpMock, '/api/reportes/pdf', 'GET');
      expectParams(req, {
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-31',
      });
      req.flush({ reporte: 'abc123' });
    });

    it('sends cliente param in PDF request when provided', () => {
      service
        .getReportPdf({ ...requiredParams, cliente: 'client-001' })
        .subscribe();

      const req = expectRequest(httpMock, '/api/reportes/pdf', 'GET');
      expectParams(req, { cliente: 'client-001' });
      req.flush({ reporte: 'xyz' });
    });

    it('accepts legacy base64 PDF payload', () => {
      service
        .getReportPdf(requiredParams)
        .subscribe((response) => expect(response.base64).toBe('abc123'));

      const req = expectRequest(httpMock, '/api/reportes/pdf', 'GET');
      req.flush({ base64: 'abc123' });
    });
  });
});
