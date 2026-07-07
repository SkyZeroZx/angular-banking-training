import { Injectable } from '@nestjs/common';
import { conflict, notFound } from '../common/domain-error';
import { includesIgnoreCase } from '../common/text';
import { PageQuery, PagedResponse, parsePageable, sortAndPaginate } from '../common/pagination';
import { Client } from '../database/entities';
import { InMemoryStore } from '../database/in-memory.store';
import { ClientRequestDto, ClientResponseDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly store: InMemoryStore) {}

  findAll(query: PageQuery): PagedResponse<ClientResponseDto> {
    const pageable = parsePageable(query, 'nombre', 'asc');
    const search = query.search?.trim() ?? '';
    const filtered = search
      ? this.store.clients.filter(
          (client) =>
            includesIgnoreCase(client.nombre, search) ||
            includesIgnoreCase(client.identificacion, search),
        )
      : this.store.clients;

    const page = sortAndPaginate(filtered, pageable, (client, field) =>
      field in client ? client[field as keyof Client] : '',
    );

    return {
      ...page,
      content: page.content.map((client) => this.toResponse(client)),
    };
  }

  findByClienteId(clienteId: string): ClientResponseDto {
    return this.toResponse(this.findEntityByClienteId(clienteId));
  }

  create(request: ClientRequestDto): ClientResponseDto {
    this.assertUniqueIdentification(request.identificacion);

    const client: Client = {
      id: this.store.nextClientId(),
      clienteId: this.store.createClientId(),
      nombre: request.nombre,
      genero: request.genero,
      edad: request.edad,
      identificacion: request.identificacion,
      direccion: request.direccion,
      telefono: request.telefono,
      contrasenaHash: this.store.hashPassword(request.contrasena),
      estado: request.estado,
    };
    this.store.clients.push(client);
    return this.toResponse(client);
  }

  update(clienteId: string, request: ClientRequestDto): ClientResponseDto {
    const client = this.findEntityByClienteId(clienteId);
    this.assertUniqueIdentification(request.identificacion, client.id);

    client.nombre = request.nombre;
    client.genero = request.genero;
    client.edad = request.edad;
    client.identificacion = request.identificacion;
    client.direccion = request.direccion;
    client.telefono = request.telefono;
    client.estado = request.estado;

    if (request.contrasena?.trim()) {
      client.contrasenaHash = this.store.hashPassword(request.contrasena);
    }

    return this.toResponse(client);
  }

  partialUpdate(clienteId: string, request: Partial<ClientRequestDto>): ClientResponseDto {
    const client = this.findEntityByClienteId(clienteId);

    if (request.identificacion !== undefined) {
      this.assertUniqueIdentification(request.identificacion, client.id);
      client.identificacion = request.identificacion;
    }
    if (request.nombre !== undefined) client.nombre = request.nombre;
    if (request.genero !== undefined) client.genero = request.genero;
    if (request.edad !== undefined) client.edad = request.edad;
    if (request.direccion !== undefined) client.direccion = request.direccion;
    if (request.telefono !== undefined) client.telefono = request.telefono;
    if (request.estado !== undefined) client.estado = request.estado;
    if (request.contrasena?.trim()) {
      client.contrasenaHash = this.store.hashPassword(request.contrasena);
    }

    return this.toResponse(client);
  }

  delete(clienteId: string): void {
    const client = this.findEntityByClienteId(clienteId);
    const hasAccounts = this.store.accounts.some((account) => account.clienteId === client.id);

    if (hasAccounts) {
      client.estado = false;
      return;
    }

    this.store.clients = this.store.clients.filter((item) => item.id !== client.id);
  }

  findEntityByClienteId(clienteId: string): Client {
    const client = this.store.clients.find((item) => item.clienteId === clienteId);
    if (!client) throw notFound('Client', 'clienteId', clienteId);
    return client;
  }

  toResponse(client: Client): ClientResponseDto {
    return {
      clienteId: client.clienteId,
      nombre: client.nombre,
      genero: client.genero,
      edad: client.edad,
      identificacion: client.identificacion,
      direccion: client.direccion,
      telefono: client.telefono,
      estado: client.estado,
    };
  }

  private assertUniqueIdentification(identificacion: string, currentId?: number) {
    const duplicate = this.store.clients.some(
      (client) => client.identificacion === identificacion && client.id !== currentId,
    );
    if (duplicate) {
      throw conflict('Identification already registered');
    }
  }
}
