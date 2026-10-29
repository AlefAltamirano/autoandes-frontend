import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cargando = signal(false);
  errorMensaje = signal<string | null>(null);
  expirada = signal(false);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit() {
    this.expirada.set(this.route.snapshot.queryParams['expirada'] === 'true');
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/');
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err.error?.mensaje ?? 'Error al iniciar sesión');
      }
    });
  }
}
