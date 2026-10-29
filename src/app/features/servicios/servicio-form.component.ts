import { Component, inject, signal } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { ServicioService } from '../../core/services/servicio.service';
import { FieldErrorComponent } from '../../shared/field-error.component';
@Component({imports:[ReactiveFormsModule,RouterLink,FieldErrorComponent],template:`<section class="card form-card"><h1>{{id?'Editar':'Nuevo'}} servicio</h1>
@if(error()){<p class="alert" role="alert">{{error()}}</p>} @if(cargando()){<p role="status">Cargando…</p>}
<form [formGroup]="form" (ngSubmit)="guardar()"><fieldset [disabled]="cargando() || enviando()">
<label for="codigo">Código</label><input id="codigo" formControlName="codigo" placeholder="SRV-009"><app-field-error [control]="form.controls.codigo" [mensaje]="campos()['codigo']" />
<label for="nombre">Nombre</label><input id="nombre" formControlName="nombre"><app-field-error [control]="form.controls.nombre" [mensaje]="campos()['nombre']" />
<label for="precio">Precio (S/)</label><input id="precio" type="number" step="0.01" formControlName="precio"><app-field-error [control]="form.controls.precio" [mensaje]="campos()['precio']" />
<label for="duracion">Duración (minutos)</label><input id="duracion" type="number" formControlName="duracionMin"><app-field-error [control]="form.controls.duracionMin" [mensaje]="campos()['duracionMin']" />
<div class="actions"><button class="btn btn-primary" [disabled]="form.invalid || enviando() || cargando()">{{enviando()?'Guardando…':'Guardar servicio'}}</button><a routerLink="/servicios">Cancelar</a></div></fieldset></form></section>`})
export class ServicioFormComponent {
 private api=inject(ServicioService); private router=inject(Router); id=Number(inject(ActivatedRoute).snapshot.paramMap.get('id'))||undefined; private fb=inject(FormBuilder);
 error=signal('');campos=signal<Record<string,string>>({});enviando=signal(false);cargando=signal(false);
 form=this.fb.nonNullable.group({codigo:['',[Validators.required,Validators.pattern(/^SRV-\d{3}$/)]],nombre:['',[Validators.required,Validators.minLength(3),Validators.maxLength(80)]],precio:[1,[Validators.required,Validators.min(0.01)]],duracionMin:[30,[Validators.required,Validators.min(15),Validators.max(480)]]});
 constructor(){if(this.id){this.cargando.set(true);this.api.obtener(this.id).subscribe({next:s=>{this.form.patchValue(s);this.cargando.set(false);},error:e=>{this.error.set(e.error?.mensaje??'No se pudo cargar');this.cargando.set(false);}});}}
 guardar(){this.form.markAllAsTouched();if(this.form.invalid||this.enviando())return;this.enviando.set(true);this.campos.set({});this.api.guardar(this.form.getRawValue(),this.id).subscribe({next:()=>this.router.navigateByUrl('/servicios'),error:e=>{this.enviando.set(false);this.error.set(e.error?.mensaje??'No se pudo guardar');this.campos.set(e.error?.campos??{});}});}
}
