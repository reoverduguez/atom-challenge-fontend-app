/* eslint-disable @angular-eslint/prefer-standalone */
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Auth, signInWithCustomToken } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, EMPTY, filter, finalize, of, switchMap, take } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { UserCreateConfirmationDialogComponent } from '../../shared/components/user-create-confirmation-dialog/user-create-confirmation-dialog.component';
import { ApiErrorResponse } from '../../shared/models/api-responses.model';
import {
  CreateUserConfirmationDialogCloseData,
  CreateUserConfirmationDialogData,
} from '../../shared/models/custom-dialog-data.model';

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
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  public readonly title = 'Task Manager';

  public loginButtonDisabled = false;
  public loading = false;

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public login(): void {
    const { email } = this.loginForm.value;

    if (this.loginForm.invalid || !email || email.trim().length === 0 || this.loading) {
      return;
    }

    this.loading = true;
    this.loginForm.disable();
    this.loginButtonDisabled = true;

    this.authService
      .login(email)
      .pipe(
        take(1),
        catchError((err) => {
          if (err.status === HttpStatusCode.Unauthorized) {
            return this.dialog
              .open<UserCreateConfirmationDialogComponent, CreateUserConfirmationDialogData>(
                UserCreateConfirmationDialogComponent,
                {
                  disableClose: true,
                  data: { email },
                },
              )
              .afterClosed()
              .pipe(
                take(1),
                filter(
                  (result: CreateUserConfirmationDialogCloseData) =>
                    !!result?.error || !!result?.token,
                ),
                switchMap((result: CreateUserConfirmationDialogCloseData) => {
                  if (result.error) {
                    console.error(err);
                    const message = `❌ ${result.error}`;
                    this.snackBar.open(message, 'Ok', {
                      duration: 5000,
                      horizontalPosition: 'center',
                      verticalPosition: 'top',
                    });
                    return EMPTY;
                  }
                  return of({ token: result.token! });
                }),
              );
          } else {
            console.error(err);
            const apiError = err.error as ApiErrorResponse;
            const message = `❌ ${apiError.error}`;
            this.snackBar.open(message, 'Ok', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            return EMPTY;
          }
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe(async (response) => {
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
          this.loginForm.enable();
          this.loginButtonDisabled = false;
        }
      });
  }
}
