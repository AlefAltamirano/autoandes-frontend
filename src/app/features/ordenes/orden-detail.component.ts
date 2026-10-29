import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrdenService } from '../../core/services/orden.service';
import { AuthService } from '../../core/auth/auth.service';
import { Orden } from '../../core/models/autoandes';
import { FieldErrorComponent } from '../../shared/field-error.component';
@Component({
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe, DatePipe, FieldErrorComponent],
  template: `<section class="card">
    <a routerLink="/ordenes">Volver a órdenes</a>
    @if (error()) {
      <p class="alert" role="alert">{{ error() }}</p>
    }
    @if (cargando()) {
      <p role="status">Cargando orden…</p>
    }
    @if (orden(); as o) {
      <h1>{{ o.numero }}</h1>
      <p>{{ o.fecha | date: 'dd/MM/yyyy HH:mm' }} · {{ o.placa }} · {{ o.kilometraje }} km</p>
      <p>
        Estado: <strong>{{ o.estado }}</strong> · Registrado por {{ o.usuarioRegistro }}
      </p>
      <div class="table-scroll">
        <table>
          <caption>
            Servicios de la orden
          </caption>
          <thead>
            <tr>
              <th>Código</th>
              <th>Servicio</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            @for (d of o.detalles; track d.servicioId) {
              <tr>
                <td>{{ d.codigo }}</td>
                <td>{{ d.servicio }}</td>
                <td>{{ d.cantidad }}</td>
                <td>{{ d.precioUnitario | currency: 'PEN' : 'S/ ' }}</td>
                <td>{{ d.subtotal | currency: 'PEN' : 'S/ ' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <p class="total">Total: {{ o.total | currency: 'PEN' : 'S/ ' }}</p>
      @if (o.motivoAnulacion) {
        <p>Motivo: {{ o.motivoAnulacion }}</p>
      }
      @if (auth.tienePermiso('ORDEN_ANULAR') && o.estado === 'REGISTRADA') {
        <form [formGroup]="form" (ngSubmit)="anular()">
          <label for="motivo">Motivo de anulación (10 a 200 caracteres)</label
          ><textarea id="motivo" formControlName="motivo"></textarea
          ><app-field-error [control]="form.controls.motivo" [mensaje]="campo()" /><button
            class="btn btn-danger"
            [disabled]="form.invalid || enviando()"
          >
            {{ enviando() ? 'Anulando…' : 'Anular orden' }}
          </button>
        </form>
      }
    }
  </section>`,
})
export class OrdenDetailComponent {
  private api = inject(OrdenService);
  auth = inject(AuthService);
  private id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  private fb = inject(FormBuilder);
  orden = signal<Orden | null>(null);
  error = signal('');
  campo = signal<string>('');
  cargando = signal(true);
  enviando = signal(false);
  form = this.fb.nonNullable.group({
    motivo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
  });
  constructor() {
    this.api.obtener(this.id).subscribe({
      next: (o) => {
        this.orden.set(o);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.mensaje ?? 'No se pudo cargar');
        this.cargando.set(false);
      },
    });
  }
  anular() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.enviando() || !confirm('Confirmar la anulación de esta orden?'))
      return;
    this.enviando.set(true);
    this.api.anular(this.id, this.form.getRawValue().motivo).subscribe({
      next: (o) => {
        this.orden.set(o);
        this.enviando.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.mensaje ?? 'No se pudo anular');
        this.campo.set(e.error?.campos?.motivo);
        this.enviando.set(false);
      },
    });
  }
}
