import {Component,inject,signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {VehiculoService} from '../../core/services/vehiculo.service';
import {ClienteService} from '../../core/services/cliente.service';
import {AuthService} from '../../core/auth/auth.service';
import {Vehiculo,Cliente} from '../../core/models/autoandes';
@Component({imports:[RouterLink],template:`<section class="card"><div class="page-heading"><h1>Vehículos</h1>@if(auth.tienePermiso('VEHICULO_ESCRIBIR')){<a class="btn btn-primary" routerLink="/vehiculos/nuevo">Nuevo vehículo</a>}</div>
<label for="cliente">Filtrar por cliente</label><select id="cliente" #cliente (change)="cargar(cliente.value)"><option value="">Todos los clientes</option>@for(c of clientes();track c.id){<option [value]="c.id">{{c.nombres}}</option>}</select>
@if(error()){<p class="alert" role="alert">{{error()}}</p>} @if(cargando()){<p role="status">Cargando vehículos…</p>}@else{<div class="table-scroll"><table><caption class="sr-only">Vehículos de clientes</caption><thead><tr><th>Placa</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Cliente</th><th>Acciones</th></tr></thead><tbody>@for(v of items();track v.id){<tr><td>{{v.placa}}</td><td>{{v.marca}}</td><td>{{v.modelo}}</td><td>{{v.anio}}</td><td>{{v.clienteNombre}}</td><td>@if(auth.tienePermiso('VEHICULO_ESCRIBIR')){<a [routerLink]="['/vehiculos',v.id,'editar']">Editar</a><button (click)="eliminar(v)">Eliminar</button>}</td></tr>}@empty{<tr><td colspan="6">No hay vehículos.</td></tr>}</tbody></table></div>}</section>`})
export class VehiculoListComponent {
 private api=inject(VehiculoService);private clientesApi=inject(ClienteService);auth=inject(AuthService);items=signal<Vehiculo[]>([]);clientes=signal<Cliente[]>([]);cargando=signal(true);error=signal('');filtro='';
 constructor(){this.cargar();this.clientesApi.listar().subscribe({next:x=>this.clientes.set(x),error:e=>this.error.set(e.error?.mensaje??'No se pudieron cargar clientes')});}
 cargar(clienteId=''){this.filtro=clienteId;this.cargando.set(true);this.api.listar({clienteId}).subscribe({next:x=>{this.items.set(x);this.cargando.set(false);},error:e=>{this.error.set(e.error?.mensaje??'No se pudo cargar');this.cargando.set(false);}});}
 eliminar(v:Vehiculo){if(!confirm(`Eliminar el vehículo ${v.placa}?`))return;this.api.eliminar(v.id).subscribe({next:()=>this.cargar(this.filtro),error:e=>this.error.set(e.error?.mensaje??'No se pudo eliminar')});}
}
