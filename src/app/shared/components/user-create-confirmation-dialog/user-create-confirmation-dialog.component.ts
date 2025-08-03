import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, EMPTY, finalize, take } from 'rxjs';

import { AuthService } from '../../../services/auth/auth.service';
import { ApiErrorResponse } from '../../models/auth-response.model';
import { CreateUserConfirmationDialogData } from '../../models/custom-dialog-data.model';

@Component({
  selector: 'app-user-create-confirmation-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatProgressSpinnerModule,
    MatDialogTitle,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './user-create-confirmation-dialog.component.html',
  styleUrl: './user-create-confirmation-dialog.component.css',
})
export class UserCreateConfirmationDialogComponent {
  public readonly dialogData = inject<CreateUserConfirmationDialogData>(MAT_DIALOG_DATA);

  public loading = false;

  private readonly authService = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef<UserCreateConfirmationDialogComponent>);

  public createUser(): void {
    this.loading = true;
    this.authService
      .register(this.dialogData.email)
      .pipe(
        take(1),
        finalize(() => (this.loading = false)),
        catchError((err) => {
          const apiError = err.error as ApiErrorResponse;
          this.dialogRef.close({ error: apiError.error });
          return EMPTY;
        }),
      )
      .subscribe((response) => this.dialogRef.close({ token: response.token }));
  }
}
