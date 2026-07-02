import { HttpTestingController } from '@angular/common/http/testing';
import {
  expectMissingParams,
  expectParams,
  expectRequest,
  pagedResponse,
  setupHttpService,
} from '@app/spec-helpers/http.spec-helper';
import { MovementRequest, MovementResponse } from '@core/interface';
import { environment } from '@env/environment';
import { MovementService } from './movement.service';

const BASE = `${environment.API_URL}/api/movimientos`;

describe('MovementService', () => {
  let service: MovementService;
  let httpTesting: HttpTestingController;

  const movement: MovementResponse = {
    id: 1,
    fecha: '2024-01-15T10:00:00',
    tipoMovimiento: 'CREDITO',
    valor: 500,
    saldo: 1500,
    numeroCuenta: 'ACC001',
  };

  const payload: MovementRequest = {
    tipoMovimiento: 'DEBITO',
    valor: 200,
    numeroCuenta: 'ACC001',
  };

  beforeEach(() => {
    ({ service, http: httpTesting } = setupHttpService(MovementService));
  });

  afterEach(() => httpTesting.verify());

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('calls GET on the base URL with pagination params', () => {
      service.getAll({ page: 1, size: 10 }).subscribe();

      const req = expectRequest(httpTesting, BASE, 'GET');
      expectParams(req, { page: '1', size: '10' });
      req.flush(pagedResponse([movement], { size: 10 }));
    });

    it('calls GET without params when none are supplied', () => {
      service.getAll().subscribe();

      const req = expectRequest(httpTesting, BASE, 'GET');
      expectMissingParams(req, ['page', 'size', 'sort', 'search']);
      req.flush(pagedResponse([movement]));
    });
  });

  it('calls GET /api/movimientos/:id', () => {
    service.getById(1).subscribe();

    const req = expectRequest(httpTesting, `${BASE}/1`, 'GET');
    req.flush(movement);
  });

  it('calls POST on the base URL with the body', () => {
    service.create(payload).subscribe();

    const req = expectRequest(httpTesting, BASE, 'POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...movement, ...payload });
  });

  it('calls DELETE /api/movimientos/:id', () => {
    service.delete(1).subscribe();

    const req = expectRequest(httpTesting, `${BASE}/1`, 'DELETE');
    req.flush(null);
  });
});
