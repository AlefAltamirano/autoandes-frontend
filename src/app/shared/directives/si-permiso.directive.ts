import {Directive,input,inject,effect,TemplateRef,ViewContainerRef} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';import {Permiso} from '../../core/auth/auth.model';
@Directive({selector:'[appSiPermiso]'})
export class SiPermisoDirective {
 appSiPermiso=input.required<Permiso>();private auth=inject(AuthService);private template=inject(TemplateRef<unknown>);private view=inject(ViewContainerRef);
 constructor(){effect(()=>{const visible=this.auth.tienePermiso(this.appSiPermiso());this.view.clear();if(visible)this.view.createEmbeddedView(this.template);});}
}
