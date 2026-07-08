import { Injectable, inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';

type Client = {
  clienteId: string;
  nombre: string;
};

@Injectable({ providedIn: 'root' })
export class ResolverDemoClientsService {
  private readonly clients = new Map<string, Client>([
    ['client-001', { clienteId: 'client-001', nombre: 'Jose Lema' }],
    ['client-002', { clienteId: 'client-002', nombre: 'Marianela Montalvo' }],
  ]);

  getById(clienteId: string): Observable<Client> {
    const client = this.clients.get(clienteId);

    return client
      ? of(client)
      : throwError(() => new Error(`Client ${clienteId} not found`));
  }
}

export const clientResolver: ResolveFn<Client | RedirectCommand> = (route) => {
  const router = inject(Router);
  const clients = inject(ResolverDemoClientsService);
  const clienteId = route.paramMap.get('clienteId');

  if (!clienteId) {
    return new RedirectCommand(
      router.parseUrl('/workshop/resolver-redirect/no-encontrado'),
    );
  }

  return clients
    .getById(clienteId)
    .pipe(
      catchError(() =>
        of(
          new RedirectCommand(
            router.parseUrl('/workshop/resolver-redirect/no-encontrado'),
          ),
        ),
      ),
    );
};
