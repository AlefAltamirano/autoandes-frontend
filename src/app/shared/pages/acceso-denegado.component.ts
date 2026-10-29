import {Component} from '@angular/core';import {RouterLink} from '@angular/router';
@Component({imports:[RouterLink],template:`<section class="card"><h1>Acceso denegado</h1><p>Tu sesión sigue activa. No tienes el permiso necesario para esta página.</p><a routerLink="/servicios">Volver a servicios</a></section>`})export class AccesoDenegadoComponent {}
