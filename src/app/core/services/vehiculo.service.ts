import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Vehiculo } from '../models/autoandes';
@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/vehiculos';
  listar(filtros: Record<string, string | number> = {}) {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filtros)) if (v !== '') params = params.set(k, v);
    return this.http.get<Vehiculo[]>(this.url, { params });
  }
  obtener(id: number) {
    return this.http.get<Vehiculo>(`${this.url}/${id}`);
  }
  guardar(body: Omit<Vehiculo, 'id' | 'clienteNombre'>, id?: number) {
    return id
      ? this.http.put<Vehiculo>(`${this.url}/${id}`, body)
      : this.http.post<Vehiculo>(this.url, body);
  }
  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
