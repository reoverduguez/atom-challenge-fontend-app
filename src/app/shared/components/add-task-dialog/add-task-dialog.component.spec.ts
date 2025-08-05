import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth, User } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';

import { AddTaskDialogComponent } from './add-task-dialog.component';
import { createTask, createTaskSuccess } from '../../../state/tasks/tasks.actions';
import { selectTasksLoading } from '../../../state/tasks/tasks.selectors';
import { Task } from '../../models/task.model';

describe('AddTaskDialogComponent', () => {
  let component: AddTaskDialogComponent;
  let fixture: ComponentFixture<AddTaskDialogComponent>;
  let store: MockStore;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddTaskDialogComponent>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actions$: Subject<any>;
  let dispatchSpy: jasmine.Spy;
  let mockAuth: Partial<Auth>;

  const mockUserId = 'mock-user-id';

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    actions$ = new Subject();

    mockAuth = {
      currentUser: { uid: mockUserId } as User,
    };

    await TestBed.configureTestingModule({
      imports: [AddTaskDialogComponent, NoopAnimationsModule],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTasksLoading, value: false }],
        }),
        provideMockActions(() => actions$),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: Auth, useValue: mockAuth },
        FormBuilder,
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AddTaskDialogComponent);
    component = fixture.componentInstance;
    dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  afterEach(() => {
    actions$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch createTask on valid form submission', () => {
    component.taskForm.setValue({ title: 'Test Task', description: 'Test Description' });

    component.createTask();

    expect(dispatchSpy).toHaveBeenCalledWith(
      createTask({
        task: {
          title: 'Test Task',
          description: 'Test Description',
          completed: false,
          owner: mockUserId,
        },
      }),
    );
  });

  it('should not dispatch if form is invalid', () => {
    component.taskForm.setValue({ title: '', description: '' });

    component.createTask();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should close dialog on createTaskSuccess', () => {
    actions$.next(createTaskSuccess({ task: {} as Task }));

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
