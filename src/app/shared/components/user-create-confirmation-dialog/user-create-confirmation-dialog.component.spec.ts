import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateConfirmationDialogComponent } from './user-create-confirmation-dialog.component';

describe('UserCreateConfirmationDialogComponent', () => {
  let component: UserCreateConfirmationDialogComponent;
  let fixture: ComponentFixture<UserCreateConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateConfirmationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
