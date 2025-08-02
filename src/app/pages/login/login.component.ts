/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, inject } from '@angular/core';
import { Auth, signInWithCustomToken } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, EMPTY, take } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { ApiErrorResponse } from '../../shared/models/auth-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  public readonly title = 'Task Manager';

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public login(): void {
    const { email } = this.loginForm.value;

    if (this.loginForm.invalid || !email || email.trim().length === 0) {
      return;
    }
    this.authService
      .login(email)
      .pipe(
        take(1),
        catchError((err) => {
          const apiError = err.error as ApiErrorResponse;
          this.snackBar.open(apiError.error, 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          return EMPTY;
        }),
      )
      .subscribe(async (response) => {
        console.log('response', response);
        try {
          await signInWithCustomToken(this.auth, response.token);
          localStorage.setItem('authToken', response.token);
          this.router.navigateByUrl('/');
        } catch (err) {
          console.error(err);
          const message = `Firebase login failed: ${err}`;
          this.snackBar.open(message, 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      });
  }
}
