import {inject} from '@angular/core';import {CanActivateFn,Router} from '@angular/router';import {AuthService} from '../auth/auth.service';
export const authGuard:CanActivateFn=(_,state)=>inject(AuthService).vigente()||inject(Router).createUrlTree(['/login'],{queryParams:{returnUrl:state.url}});
