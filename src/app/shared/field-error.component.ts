import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-field-error',
  template: `@if (mensaje()) {
      <small class="field-error" role="alert">{{ mensaje() }}</small>
    } @else if (control()?.invalid && control()?.touched) {
      <small class="field-error" role="alert">{{ validacion() }}</small>
    }`,
})
export class FieldErrorComponent {
  control = input<AbstractControl | null>(null);
  mensaje = input<string>();
  validacion() {
    const e = this.control()?.errors;
    if (e?.['required']) return 'Este campo es obligatorio';
    if (e?.['pattern']) return 'Formato inválido';
    if (e?.['minlength']) return 'El texto es demasiado corto';
    if (e?.['maxlength']) return 'El texto es demasiado largo';
    if (e?.['min']) return 'Valor mínimo: ' + e['min'].min;
    if (e?.['max']) return 'Valor máximo: ' + e['max'].max;
    return 'Valor inválido';
  }
}
