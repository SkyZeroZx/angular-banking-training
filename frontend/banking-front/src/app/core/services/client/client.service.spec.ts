import { HttpTestingController } from '@angular/common/http/testing';
import {
  expectMissingParams,
  expectParams,
  expectRequest,
  pagedResponse,
  setupHttpService,
} from '@app/spec-helpers/http.spec-helper';
import { environment } from '@env/environment';
import { ClientRequest, ClientResponse } from '@core/interface';
import { ClientService } from './client.service';

const BASE = `${environment.API_URL}/api/clientes`;

describe('ClientService', () => {
  let service: ClientService;
  let httpTesting: HttpTestingController;

  const client: ClientResponse = {
    clienteId: 'c1',
    nombre: 'Maria',
    identificacion: '001',
    genero: 'F',
    edad: 30,
    direccion: 'Av 1',
    telefono: '111',
    estado: true,
  };

  const payload: ClientRequest = {
    nombre: 'Pedro',
    identificacion: '002',
    genero: 'M',
    edad: 25,
    direccion: 'Calle 2',
    telefono: '222',
    estado: true,
    contrasena: 'pass',
  };

  beforeEach(() => {
    ({ service, http: httpTesting } = setupHttpService(ClientService));
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
      req.flush(pagedResponse([client], { size: 10 }));
    });

    it('calls GET without params when none supplied', () => {
      service.getAll().subscribe();

      const req = expectRequest(httpTesting, BASE, 'GET');
      expectMissingParams(req, ['page', 'size', 'sort', 'search']);
      req.flush(pagedResponse([client]));
    });
  });

  it('calls GET /api/clientes/:id', () => {
    service.getById('c1').subscribe();

    const req = expectRequest(httpTesting, `${BASE}/c1`, 'GET');
    req.flush(client);
  });

  it('calls POST on the base URL with the body', () => {
    service.create(payload).subscribe();

    const req = expectRequest(httpTesting, BASE, 'POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...payload, clienteId: 'c2' });
  });

  it('calls PUT /api/clientes/:id with the body', () => {
    service.update('c1', payload).subscribe();

    const req = expectRequest(httpTesting, `${BASE}/c1`, 'PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...payload, clienteId: 'c1' });
  });

  it('calls DELETE /api/clientes/:id', () => {
    service.delete('c1').subscribe();

    const req = expectRequest(httpTesting, `${BASE}/c1`, 'DELETE');
    req.flush(null);
  });
});
