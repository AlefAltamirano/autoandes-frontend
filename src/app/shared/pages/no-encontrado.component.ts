import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  imports: [RouterLink],
  template: `<section class="card">
    <h1>404 · Página no encontrada</h1>
    <p>La dirección solicitada no existe.</p>
    <a routerLink="/">Ir al inicio</a>
  </section>`,
})
export class NoEncontradoComponent {}
