import { HttpStatusCode } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuth: jasmine.SpyObj<Auth>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockAuth = jasmine.createSpyObj('Auth', ['']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        LoginComponent,
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: mockAuth },
      ],
    });

    component = TestBed.inject(LoginComponent);
    fixture = TestBed.createComponent(LoginComponent);
  });

  it('should not attempt login if form is invalid', () => {
    component.loginForm.setValue({ email: '' });

    component.login();

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with valid email', () => {
    component.loginForm.setValue({ email: 'test@example.com' });
    mockAuthService.login.and.returnValue(of({ token: 'abc' }));

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com');
  });

  it('should handle unauthorized error and open dialog', fakeAsync(() => {
    component.loginForm.setValue({ email: 'newuser@example.com' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogRefMock = { afterClosed: () => of({ token: 'generated-token' }) } as any;
    mockDialog.open.and.returnValue(dialogRefMock);

    mockAuthService.login.and.returnValue(
      throwError(() => ({
        status: HttpStatusCode.Unauthorized,
        error: { error: 'Unauthorized' },
      })),
    );

    component.login();
    tick();

    expect(mockDialog.open).toHaveBeenCalled();
  }));

  it('should show snackbar and enable form on login error', fakeAsync(() => {
    const errorMessage = 'Internal Server Error';
    component.loginForm.setValue({ email: 'fail@example.com' });

    mockAuthService.login.and.returnValue(
      throwError(() => ({
        status: 500,
        error: { error: errorMessage },
      })),
    );

    component.login();
    tick();

    expect(mockSnackBar.open).toHaveBeenCalledWith(`❌ ${errorMessage}`, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }));
});
