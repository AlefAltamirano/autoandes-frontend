import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
describe('Sesion de mostrador', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: { url: '/ordenes', navigate: vi.fn().mockResolvedValue(true) },
        },
      ],
    });
  });
  afterEach(() => {
    sessionStorage.clear();
    vi.useRealTimers();
  });
  it('recupera una sesion corrupta sin bloquear el arranque', () => {
    sessionStorage.setItem('autoandes.sesion', '{invalido');
    expect(TestBed.inject(AuthService).sesionActual()).toBeNull();
  });
  it('descarta una sesion vencida', () => {
    sessionStorage.setItem(
      'autoandes.sesion',
      JSON.stringify({ token: 'x', expiracion: Date.now() - 1, roles: [], permisos: [] }),
    );
    expect(TestBed.inject(AuthService).vigente()).toBe(false);
  });
  it('guarda permisos y cierra automaticamente al vencer', () => {
    vi.useFakeTimers();
    const auth = TestBed.inject(AuthService);
    const http = TestBed.inject(HttpTestingController);
    auth.login({ username: 'asesor', password: 'prueba' }).subscribe();
    http
      .expectOne(environment.apiUrl + '/auth/login')
      .flush({
        token: 'firmado',
        expiraEnSegundos: 1,
        nombreCompleto: 'Asesor',
        roles: ['ASESOR'],
        permisos: ['ORDEN_REGISTRAR'],
      });
    expect(auth.tienePermiso('ORDEN_REGISTRAR')).toBe(true);
    expect(auth.tienePermiso('ORDEN_ANULAR')).toBe(false);
    expect(sessionStorage.getItem('autoandes.sesion')).toContain('firmado');
    vi.advanceTimersByTime(1001);
    expect(auth.sesionActual()).toBeNull();
    expect(sessionStorage.getItem('autoandes.sesion')).toBeNull();
    http.verify();
  });
});
