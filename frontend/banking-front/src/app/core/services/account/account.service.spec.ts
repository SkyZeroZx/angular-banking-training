import { HttpTestingController } from '@angular/common/http/testing';
import {
  expectParams,
  expectRequest,
  pagedResponse,
  setupHttpService,
} from '@app/spec-helpers/http.spec-helper';
import { AccountRequest, AccountResponse } from '@core/interface';
import { environment } from '@env/environment';
import { AccountService } from './account.service';

const BASE = `${environment.API_URL}/api/cuentas`;

describe('AccountService', () => {
  let service: AccountService;
  let httpTesting: HttpTestingController;

  const account: AccountResponse = {
    numeroCuenta: 'ACC001',
    tipoCuenta: 'AHORRO',
    saldoInicial: 1000,
    estado: true,
    cliente: 'Maria',
    clienteId: 'c1',
  };

  const payload: AccountRequest = {
    numeroCuenta: 'ACC002',
    tipoCuenta: 'AHORRO',
    saldoInicial: 500,
    estado: true,
    clienteId: 'c1',
  };

  beforeEach(() => {
    ({ service, http: httpTesting } = setupHttpService(AccountService));
  });

  afterEach(() => httpTesting.verify());

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  it('calls GET on the base URL with page and size params', () => {
    service.getAll({ page: 2, size: 10 }).subscribe();

    const req = expectRequest(httpTesting, BASE, 'GET');
    expectParams(req, { page: '2', size: '10' });
    req.flush(pagedResponse([account], { page: 2, size: 10 }));
  });

  it('calls GET /api/cuentas/:numeroCuenta', () => {
    service.getById('ACC001').subscribe();

    const req = expectRequest(httpTesting, `${BASE}/ACC001`, 'GET');
    req.flush(account);
  });

  it('calls POST on the base URL with the body', () => {
    service.create(payload).subscribe();

    const req = expectRequest(httpTesting, BASE, 'POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...account, numeroCuenta: 'ACC002' });
  });

  it('calls PUT /api/cuentas/:numeroCuenta with the body', () => {
    service.update('ACC001', payload).subscribe();

    const req = expectRequest(httpTesting, `${BASE}/ACC001`, 'PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(account);
  });

  it('calls DELETE /api/cuentas/:numeroCuenta', () => {
    service.delete('ACC001').subscribe();

    const req = expectRequest(httpTesting, `${BASE}/ACC001`, 'DELETE');
    req.flush(null);
  });
});
