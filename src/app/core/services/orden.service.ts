import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Orden, OrdenRequest } from '../models/autoandes';
@Injectable({ providedIn: 'root' })
export class OrdenService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/ordenes';
  listar(filtros: Record<string, string | number> = {}) {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filtros)) if (v !== '') params = params.set(k, v);
    return this.http.get<Orden[]>(this.url, { params });
  }
  obtener(id: number) {
    return this.http.get<Orden>(`${this.url}/${id}`);
  }

  registrar(body: OrdenRequest) {
    return this.http.post<Orden>(this.url, body);
  }
  anular(id: number, motivo: string) {
    return this.http.patch<Orden>(`${this.url}/${id}/anular`, { motivo });
  }
}
