import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Ingreso } from '../models/autoandes';
@Injectable({providedIn:'root'})
export class ReporteService {
 private http=inject(HttpClient); private url=environment.apiUrl+'/reportes/ingresos-por-servicio';
 listar(filtros:Record<string,string|number>={}) { let params=new HttpParams(); for (const [k,v] of Object.entries(filtros)) if(v!=='') params=params.set(k,v); return this.http.get<Ingreso[]>(this.url,{params}); }
 obtener(id:number) { return this.http.get<Ingreso>(`${this.url}/${id}`); }
 
 
}
