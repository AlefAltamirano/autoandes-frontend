import {TestBed} from '@angular/core/testing';
import {HttpClient,provideHttpClient,withInterceptors} from '@angular/common/http';
import {HttpTestingController,provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {errorInterceptor} from './error.interceptor';
import {environment} from '../../../environments/environment';
describe('Errores de autenticacion',()=>{
 let close:ReturnType<typeof vi.fn>;
 beforeEach(()=>{close=vi.fn();TestBed.configureTestingModule({providers:[provideRouter([]),provideHttpClient(withInterceptors([errorInterceptor])),provideHttpClientTesting(),{provide:AuthService,useValue:{cerrarSesion:close}}]});});
 function request(path:string,status:number){TestBed.inject(HttpClient).get(path).subscribe({error:()=>{}});TestBed.inject(HttpTestingController).expectOne(path).flush({mensaje:'Rechazado'},{status,statusText:'Error'});}
 it('conserva la sesion ante un 403',()=>{request(environment.apiUrl+'/reportes',403);expect(close).not.toHaveBeenCalled();});
 it('cierra la sesion por un 401 del API',()=>{request(environment.apiUrl+'/servicios',401);expect(close).toHaveBeenCalledOnce();});
 it('no cierra por credenciales incorrectas en login',()=>{request(environment.apiUrl+'/auth/login',401);expect(close).not.toHaveBeenCalled();});
 it('ignora un 401 ajeno al API',()=>{request('https://example.test/datos',401);expect(close).not.toHaveBeenCalled();});
});
