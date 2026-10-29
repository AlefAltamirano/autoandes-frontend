import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
describe('Aplicacion AutoAndes', () => {
  it('muestra el punto de entrada de rutas sin la plantilla de bienvenida', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
    const f = TestBed.createComponent(App);
    f.detectChanges();
    expect(f.nativeElement.querySelector('router-outlet')).toBeTruthy();
    expect(f.nativeElement.textContent).not.toContain('Hello');
  });
});
