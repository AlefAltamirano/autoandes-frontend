import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Servicio } from '../models/autoandes';
@Injectable({providedIn:'root'})
export class ServicioService {
 private http=inject(HttpClient); private url=environment.apiUrl+'/servicios';
 listar(filtros:Record<string,string|number>={}) { let params=new HttpParams(); for (const [k,v] of Object.entries(filtros)) if(v!=='') params=params.set(k,v); return this.http.get<Servicio[]>(this.url,{params}); }
 obtener(id:number) { return this.http.get<Servicio>(`${this.url}/${id}`); }
 guardar(body:Omit<Servicio, 'id' | 'activo'>,id?:number) { return id ? this.http.put<Servicio>(`${this.url}/${id}`,body) : this.http.post<Servicio>(this.url,body); }
 eliminar(id:number) { return this.http.delete<void>(`${this.url}/${id}`); }
 estado(id:number, activo:boolean) { return this.http.patch<Servicio>(`${this.url}/${id}/estado`,{activo}); }
}
