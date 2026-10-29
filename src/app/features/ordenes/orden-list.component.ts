import {Component,inject,signal} from '@angular/core';
import {FormBuilder,ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CurrencyPipe,DatePipe} from '@angular/common';
import {OrdenService} from '../../core/services/orden.service';
import {Orden} from '../../core/models/autoandes';
import {AuthService} from '../../core/auth/auth.service';
@Component({imports:[ReactiveFormsModule,RouterLink,CurrencyPipe,DatePipe],template:`<section class="card"><div class="page-heading"><h1>Órdenes de servicio</h1>@if(auth.tienePermiso('ORDEN_REGISTRAR')){<a class="btn btn-primary" routerLink="/ordenes/nueva">Nueva orden</a>}</div>
<form class="filters" [formGroup]="filtros" (ngSubmit)="cargar()"><div><label for="placa">Placa</label><input id="placa" formControlName="placa" placeholder="AAA-111"></div><div><label for="estado">Estado</label><select id="estado" formControlName="estado"><option value="">Todos</option><option>REGISTRADA</option><option>ANULADA</option></select></div><div><label for="desde">Desde</label><input id="desde" type="date" formControlName="desde"></div><div><label for="hasta">Hasta</label><input id="hasta" type="date" formControlName="hasta"></div><button class="btn btn-primary" [disabled]="cargando()">Consultar</button></form>
@if(error()){<p class="alert" role="alert">{{error()}}</p>}@if(cargando()){<p role="status">Cargando órdenes…</p>}@else{<div class="table-scroll"><table><caption class="sr-only">Consulta de órdenes</caption><thead><tr><th>Número</th><th>Fecha</th><th>Placa</th><th>Km</th><th>Estado</th><th>Total</th><th>Detalle</th></tr></thead><tbody>@for(o of items();track o.id){<tr><td>{{o.numero}}</td><td>{{o.fecha | date:'dd/MM/yyyy HH:mm'}}</td><td>{{o.placa}}</td><td>{{o.kilometraje}}</td><td>{{o.estado}}</td><td>{{o.total | currency:'PEN':'S/ '}}</td><td><a [routerLink]="['/ordenes',o.id]">Ver detalle</a></td></tr>}@empty{<tr><td colspan="7">No hay órdenes con estos filtros.</td></tr>}</tbody></table></div>}</section>`})
export class OrdenListComponent {
 private api=inject(OrdenService);auth=inject(AuthService);private fb=inject(FormBuilder);items=signal<Orden[]>([]);cargando=signal(true);error=signal('');filtros=this.fb.nonNullable.group({placa:[''],estado:[''],desde:[''],hasta:['']});
 constructor(){this.cargar();}cargar(){this.cargando.set(true);this.error.set('');this.api.listar(this.filtros.getRawValue()).subscribe({next:x=>{this.items.set(x);this.cargando.set(false);},error:e=>{this.error.set(e.error?.mensaje??'No se pudo consultar');this.cargando.set(false);}});}
}
