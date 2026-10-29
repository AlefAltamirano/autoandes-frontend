import {Component,inject,signal} from '@angular/core';
import {FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
import {ActivatedRoute,Router,RouterLink} from '@angular/router';
import {VehiculoService} from '../../core/services/vehiculo.service';
import {ClienteService} from '../../core/services/cliente.service';
import {Cliente} from '../../core/models/autoandes';
import {FieldErrorComponent} from '../../shared/field-error.component';
@Component({imports:[ReactiveFormsModule,RouterLink,FieldErrorComponent],template:`<section class="card form-card"><h1>{{id?'Editar':'Nuevo'}} vehículo</h1>@if(error()){<p class="alert" role="alert">{{error()}}</p>}@if(cargando()){<p role="status">Cargando…</p>}
<form [formGroup]="form" (ngSubmit)="guardar()"><fieldset [disabled]="cargando() || enviando()">
<label for="placa">Placa</label><input id="placa" formControlName="placa" placeholder="ABC-123"><app-field-error [control]="form.controls.placa" [mensaje]="campos()['placa']" />
<label for="marca">Marca</label><input id="marca" formControlName="marca"><app-field-error [control]="form.controls.marca" [mensaje]="campos()['marca']" />
<label for="modelo">Modelo</label><input id="modelo" formControlName="modelo"><app-field-error [control]="form.controls.modelo" [mensaje]="campos()['modelo']" />
<label for="anio">Año</label><input id="anio" type="number" formControlName="anio"><app-field-error [control]="form.controls.anio" [mensaje]="campos()['anio']" />
<label for="clienteId">Cliente</label><select id="clienteId" formControlName="clienteId"><option [ngValue]="0">Seleccione un cliente</option>@for(c of clientes();track c.id){<option [ngValue]="c.id">{{c.nombres}} — {{c.documento}}</option>}</select><app-field-error [control]="form.controls.clienteId" [mensaje]="campos()['clienteId']" />
<div class="actions"><button class="btn btn-primary" [disabled]="form.invalid || enviando() || cargando()">{{enviando()?'Guardando…':'Guardar vehículo'}}</button><a routerLink="/vehiculos">Cancelar</a></div></fieldset></form></section>`})
export class VehiculoFormComponent {
 private api=inject(VehiculoService);private clientesApi=inject(ClienteService);private router=inject(Router);private fb=inject(FormBuilder);id=Number(inject(ActivatedRoute).snapshot.paramMap.get('id'))||undefined;
 clientes=signal<Cliente[]>([]);error=signal('');campos=signal<Record<string,string>>({});enviando=signal(false);cargando=signal(false);
 form=this.fb.nonNullable.group({placa:['',[Validators.required,Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],marca:['',[Validators.required,Validators.maxLength(40)]],modelo:['',[Validators.required,Validators.maxLength(40)]],anio:[2026,[Validators.required,Validators.min(1990),Validators.max(2027)]],clienteId:[0,[Validators.required,Validators.min(1)]]});
 constructor(){this.clientesApi.listar().subscribe({next:c=>this.clientes.set(c),error:e=>this.error.set(e.error?.mensaje??'No se pudieron cargar los clientes')});if(this.id){this.cargando.set(true);this.api.obtener(this.id).subscribe({next:v=>{this.form.patchValue(v);this.cargando.set(false);},error:e=>{this.error.set(e.error?.mensaje??'No se pudo cargar');this.cargando.set(false);}});}}
 guardar(){this.form.markAllAsTouched();if(this.form.invalid||this.enviando())return;this.enviando.set(true);this.campos.set({});this.api.guardar(this.form.getRawValue(),this.id).subscribe({next:()=>this.router.navigateByUrl('/vehiculos'),error:e=>{this.error.set(e.error?.mensaje??'No se pudo guardar');this.campos.set(e.error?.campos??{});this.enviando.set(false);}});}
}
