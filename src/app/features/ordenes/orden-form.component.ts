import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ServicioService } from '../../core/services/servicio.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { OrdenService } from '../../core/services/orden.service';
import { Servicio, Vehiculo, Orden } from '../../core/models/autoandes';
import { FieldErrorComponent } from '../../shared/field-error.component';
@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink, FieldErrorComponent],
  template: `<section class="card">
    <div class="page-heading">
      <h1>Nueva orden de servicio</h1>
      <a routerLink="/ordenes">Consultar órdenes</a>
    </div>
    @if (error()) {
      <p class="alert" role="alert">{{ error() }}</p>
    }
    @if (exito(); as o) {
      <p class="success" role="status">
        Orden {{ o.numero }} registrada. Total confirmado: {{ o.total | currency: 'PEN' : 'S/ ' }}.
        <a [routerLink]="['/ordenes', o.id]">Ver detalle</a>
      </p>
    }
    @if (cargando()) {
      <p role="status">Cargando vehículos y servicios…</p>
    }
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <fieldset [disabled]="cargando() || enviando()">
        <div class="form-grid">
          <div>
            <label for="vehiculo">Vehículo y cliente</label
            ><select id="vehiculo" formControlName="vehiculoId">
              <option [ngValue]="0">Seleccione un vehículo</option>
              @for (v of vehiculos(); track v.id) {
                <option [ngValue]="v.id">{{ v.placa }} — {{ v.clienteNombre }}</option>
              }</select
            ><app-field-error
              [control]="form.controls.vehiculoId"
              [mensaje]="campos()['vehiculoId']"
            />
          </div>
          <div>
            <label for="km">Kilometraje</label
            ><input id="km" type="number" formControlName="kilometraje" /><app-field-error
              [control]="form.controls.kilometraje"
              [mensaje]="campos()['kilometraje']"
            />
          </div>
        </div>
        <h2>Detalle de servicios</h2>
        <app-field-error [control]="form.controls.detalles" [mensaje]="campos()['detalles']" />
        <div formArrayName="detalles">
          @for (linea of lineas.controls; track linea; let i = $index) {
            <div class="detail-row" [formGroupName]="i">
              <div>
                <label [for]="'servicio-' + i">Servicio {{ i + 1 }}</label
                ><select [id]="'servicio-' + i" formControlName="servicioId">
                  <option [ngValue]="0">Seleccione</option>
                  @for (s of servicios(); track s.id) {
                    <option [ngValue]="s.id" [disabled]="usado(s.id, i)">
                      {{ s.nombre }} — {{ s.precio | currency: 'PEN' : 'S/ ' }}
                    </option>
                  }</select
                ><app-field-error
                  [control]="linea.controls.servicioId"
                  [mensaje]="campos()['detalles[' + i + '].servicioId']"
                />
              </div>
              <div>
                <label [for]="'cantidad-' + i">Cantidad</label
                ><input
                  [id]="'cantidad-' + i"
                  type="number"
                  formControlName="cantidad"
                  min="1"
                  max="5"
                /><app-field-error
                  [control]="linea.controls.cantidad"
                  [mensaje]="campos()['detalles[' + i + '].cantidad']"
                />
              </div>
              <p>Subtotal: {{ subtotal(i) | currency: 'PEN' : 'S/ ' }}</p>
              <button
                type="button"
                (click)="quitar(i)"
                [disabled]="lineas.length === 1"
                [attr.aria-label]="'Quitar servicio ' + (i + 1)"
              >
                Quitar
              </button>
            </div>
          }
        </div>
        <button type="button" (click)="agregar()" [disabled]="lineas.length >= 10">
          Agregar servicio
        </button>
        <p class="total" aria-live="polite">
          Total estimado: {{ total() | currency: 'PEN' : 'S/ ' }}
        </p>
        <p class="muted">El servidor confirma los precios y el total al registrar.</p>
        <div class="actions">
          <button
            class="btn btn-primary"
            [disabled]="form.invalid || repetidos() || enviando() || cargando()"
          >
            {{ enviando() ? 'Registrando…' : 'Registrar orden' }}
          </button>
        </div>
      </fieldset>
    </form>
  </section>`,
})
export class OrdenFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(OrdenService);
  private serviciosApi = inject(ServicioService);
  private vehiculosApi = inject(VehiculoService);
  servicios = signal<Servicio[]>([]);
  vehiculos = signal<Vehiculo[]>([]);
  error = signal('');
  campos = signal<Record<string, string>>({});
  exito = signal<Orden | null>(null);
  cargando = signal(true);
  enviando = signal(false);
  private linea() {
    return this.fb.nonNullable.group({
      servicioId: [0, [Validators.required, Validators.min(1)]],
      cantidad: [
        1,
        [Validators.required, Validators.min(1), Validators.max(5), Validators.pattern(/^\d+$/)],
      ],
    });
  }
  form = this.fb.nonNullable.group({
    vehiculoId: [0, [Validators.required, Validators.min(1)]],
    kilometraje: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(9999999),
        Validators.pattern(/^\d+$/),
      ],
    ],
    detalles: this.fb.array([this.linea()], [Validators.minLength(1), Validators.maxLength(10)]),
  });
  get lineas() {
    return this.form.controls.detalles;
  }
  constructor() {
    forkJoin({ s: this.serviciosApi.listar(), v: this.vehiculosApi.listar() }).subscribe({
      next: (x) => {
        this.servicios.set(x.s.filter((s) => s.activo));
        this.vehiculos.set(x.v);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.mensaje ?? 'No se pudieron cargar los datos');
        this.cargando.set(false);
      },
    });
  }
  agregar() {
    if (this.lineas.length < 10) this.lineas.push(this.linea());
  }
  quitar(i: number) {
    if (this.lineas.length > 1) this.lineas.removeAt(i);
  }
  usado(id: number, i: number) {
    return this.lineas.controls.some((c, n) => n !== i && c.controls.servicioId.value === id);
  }
  repetidos() {
    const ids = this.lineas.getRawValue().map((x) => x.servicioId);
    return new Set(ids).size !== ids.length;
  }
  subtotal(i: number) {
    const x = this.lineas.at(i).getRawValue();
    return (
      Math.round(
        (this.servicios().find((s) => s.id === x.servicioId)?.precio ?? 0) * x.cantidad * 100,
      ) / 100
    );
  }
  total() {
    return this.lineas.controls.reduce((a, _, i) => a + this.subtotal(i), 0);
  }
  guardar() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.repetidos() || this.enviando()) return;
    this.enviando.set(true);
    this.error.set('');
    this.campos.set({});
    this.exito.set(null);
    this.api.registrar(this.form.getRawValue()).subscribe({
      next: (o) => {
        this.exito.set(o);
        this.enviando.set(false);
        this.form.reset({ vehiculoId: 0, kilometraje: 0 });
        this.lineas.clear();
        this.agregar();
      },
      error: (e) => {
        this.error.set(e.error?.mensaje ?? 'No se pudo registrar');
        this.campos.set(e.error?.campos ?? {});
        this.enviando.set(false);
      },
    });
  }
}
