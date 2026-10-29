import { Component,inject,signal,computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ServicioService } from '../../core/services/servicio.service';
import { Servicio } from '../../core/models/autoandes';
import { AuthService } from '../../core/auth/auth.service';
@Component({imports:[RouterLink,CurrencyPipe],template:`
<section class="card"><div class="page-heading"><div><p class="eyebrow">CATÁLOGO DEL TALLER</p><h1>Servicios</h1></div>@if(auth.tienePermiso('SERVICIO_ESCRIBIR')){<a class="btn btn-primary" routerLink="/servicios/nuevo">Nuevo servicio</a>}</div>
<label for="buscar">Buscar por código o nombre</label><input id="buscar" #buscar type="search" (input)="busqueda.set(buscar.value)">
@if(error()){<p class="alert" role="alert">{{error()}}</p>} @if(cargando()){<p role="status">Cargando servicios…</p>} @else {
<div class="table-scroll"><table><caption class="sr-only">Catálogo de servicios</caption><thead><tr><th>Código</th><th>Servicio</th><th>Precio</th><th>Duración</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
@for(s of filtrados();track s.id){<tr><td>{{s.codigo}}</td><td>{{s.nombre}}</td><td>{{s.precio | currency:'PEN':'S/ '}}</td><td>{{s.duracionMin}} min</td><td>{{s.activo?'Activo':'Inactivo'}}</td><td>@if(auth.tienePermiso('SERVICIO_ESCRIBIR')){<a [routerLink]="['/servicios',s.id,'editar']">Editar</a><button (click)="estado(s)">{{s.activo?'Dar de baja':'Activar'}}</button><button (click)="eliminar(s)">Eliminar</button>}</td></tr>} @empty {<tr><td colspan="6">No hay servicios para esta búsqueda.</td></tr>}
</tbody></table></div>}</section>`})
export class ServicioListComponent {
 private api=inject(ServicioService); auth=inject(AuthService); items=signal<Servicio[]>([]); busqueda=signal(''); error=signal(''); cargando=signal(true);
 filtrados=computed(()=>this.items().filter(s=>(s.codigo+' '+s.nombre).toLowerCase().includes(this.busqueda().toLowerCase())));
 constructor(){this.cargar();} cargar(){this.cargando.set(true);this.api.listar().subscribe({next:x=>{this.items.set(x);this.cargando.set(false);},error:e=>{this.error.set(e.error?.mensaje??'No se pudo cargar');this.cargando.set(false);}});}
 estado(s:Servicio){if(!confirm(`${s.activo?'Dar de baja':'Activar'} ${s.nombre}?`))return;this.api.estado(s.id,!s.activo).subscribe({next:()=>this.cargar(),error:e=>this.error.set(e.error?.mensaje??'No se pudo cambiar el estado')});}
 eliminar(s:Servicio){if(!confirm(`Eliminar ${s.nombre}? Si tiene órdenes asociadas, utilice Dar de baja.`))return;this.api.eliminar(s.id).subscribe({next:()=>this.cargar(),error:e=>this.error.set(e.error?.mensaje??'No se pudo eliminar')});}
}
