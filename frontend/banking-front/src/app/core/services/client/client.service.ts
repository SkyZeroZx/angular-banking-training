import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ClientResponse, PagedResponse, PageParams } from '@core/interface';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/api/clientes`;

  getAll(params: PageParams = {}) {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.size) httpParams = httpParams.set('size', params.size);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PagedResponse<ClientResponse>>(this.baseUrl, {
      params: httpParams,
    });
  }
}
