import {HttpInterceptorFn,HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';import {Router} from '@angular/router';import {catchError,throwError} from 'rxjs';
import {AuthService} from '../auth/auth.service';import {environment} from '../../../environments/environment';
export const errorInterceptor:HttpInterceptorFn=(req,next)=>{const auth=inject(AuthService);const router=inject(Router);return next(req).pipe(catchError((e:HttpErrorResponse)=>{if(e.status===401&&req.url.startsWith(environment.apiUrl+'/')&&!req.url.endsWith('/auth/login'))auth.cerrarSesion(router.url,true);return throwError(()=>e);}));};
