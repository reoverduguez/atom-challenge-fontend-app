import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { UserCreateConfirmationDialogComponent } from './user-create-confirmation-dialog.component';
import { AuthService } from '../../../services/auth/auth.service';
import { CreateUserConfirmationDialogData } from '../../models/custom-dialog-data.model';

describe('UserCreateConfirmationDialogComponent', () => {
  let component: UserCreateConfirmationDialogComponent;
  let fixture: ComponentFixture<UserCreateConfirmationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<UserCreateConfirmationDialogComponent>>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const dialogData: CreateUserConfirmationDialogData = {
    email: 'mock@example.com',
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [UserCreateConfirmationDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.register and close dialog with token on success', () => {
    mockAuthService.register.and.returnValue(of({ token: 'mock-token' }));

    component.createUser();

    expect(mockAuthService.register).toHaveBeenCalledWith('mock@example.com');
    expect(mockDialogRef.close).toHaveBeenCalledWith({ token: 'mock-token' });
  });

  it('should close dialog with error if register fails', () => {
    const error = { error: { error: 'User already exists' } };
    mockAuthService.register.and.returnValue(throwError(() => error));

    component.createUser();

    expect(mockAuthService.register).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ error: 'User already exists' });
  });
});
