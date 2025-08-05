import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';

import { HomeComponent } from './home.component';
import { Task } from '../../shared/models/task.model';
import {
  createTaskFailure,
  deleteTaskFailure,
  updateTaskFailure,
  updateTaskSuccess,
  deleteTaskSuccess,
} from '../../state/tasks/tasks.actions';
import { TaskState } from '../../state/tasks/tasks.state';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  let mockStore: jasmine.SpyObj<Store<TaskState>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockActions$: Subject<any>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuth: jasmine.SpyObj<Auth>;

  const mockError = { error: 'mock-error', details: 'mock-detail' };

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuth = jasmine.createSpyObj('Auth', [], { currentUser: { uid: '123' } });

    mockActions$ = new Subject();

    mockStore.select.and.callFake((selector: { name: string | string[] }) => {
      if (selector.name.includes('Loading')) return of(false);
      return of([]);
    });

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatIconModule, MatTableModule],
      declarations: [HomeComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Actions, useValue: mockActions$ },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: mockAuth },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => mockActions$.complete());

  it('should dispatch loadTasks on init', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Tasks] Load Tasks',
        userId: '123',
      }),
    );
  });

  it('should open add-task dialog', () => {
    component.loading = false;
    component.addTask();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should patch form and enable editMode on editTask()', () => {
    const task: Task = {
      id: 'mock-id',
      title: 'mock-title',
      owner: 'mock-owner',
      createdAt: new Date(),
      description: 'Desc',
      completed: false,
    };

    component.editTask(task);

    expect(component.editForm.value.title).toBe('mock-title');
    expect(component.editMode).toBeTrue();
    expect(component.pendingTaskId).toBe('mock-id');
  });

  it('should cancel edit and reset form', () => {
    const task: Task = {
      id: 'mock-id',
      title: 'mock-title',
      owner: 'mock-owner',
      createdAt: new Date(),
      description: 'Desc',
      completed: false,
    };

    component.cancelEdit(task);

    expect(component.editMode).toBeFalse();
    expect(component.pendingTaskId).toBeNull();
    expect(component.editForm.value.title).toBe('mock-title');
  });

  it('should not dispatch updateTask if form is invalid', () => {
    component.saveTask('123');
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      jasmine.objectContaining({ type: '[Tasks] Update Task' }),
    );
  });

  it('should dispatch updateTask if form is valid', () => {
    component.editForm.setValue({
      title: 'New Task',
      description: 'Details',
      completed: true,
    });

    component.saveTask('456');

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Tasks] Update Task',
        id: '456',
        task: {
          title: 'New Task',
          description: 'Details',
          completed: true,
        },
      }),
    );
  });

  it('should dispatch deleteTask and set pendingTaskId', () => {
    component.loading = false;
    component.deleteTask('mock-id');

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Tasks] Delete Task',
        id: 'mock-id',
      }),
    );
    expect(component.pendingTaskId).toBe('mock-id');
  });

  it('should dispatch updateTask on checkbox toggle', () => {
    const event = { checked: true } as MatCheckboxChange;

    component.loading = false;
    component.checkboxToggle('123', event);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: '[Tasks] Update Task',
        id: '123',
        task: { completed: true },
      }),
    );
    expect(component.pendingTaskId).toBe('123');
  });

  it('should show snackbar on createTaskFailure', () => {
    mockActions$.next(createTaskFailure({ error: mockError }));

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      '❌ Failed to create task: mock-error',
      'Ok',
      jasmine.any(Object),
    );
  });

  it('should show snackbar on deleteTaskFailure', () => {
    mockActions$.next(deleteTaskFailure({ error: mockError }));

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      '❌ Failed to delete task: mock-error',
      'Ok',
      jasmine.any(Object),
    );
  });

  it('should show snackbar on updateTaskFailure', () => {
    mockActions$.next(updateTaskFailure({ error: mockError }));

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      '❌ Failed to update task: mock-error',
      'Ok',
      jasmine.any(Object),
    );
  });

  it('should reset editForm on updateTaskSuccess', () => {
    component.editMode = true;
    component.pendingTaskId = 'abc';
    component.editForm.controls.title.setValue('mock-title');

    mockActions$.next(updateTaskSuccess({ task: { title: 'mock-title' } as Task }));

    expect(component.editMode).toBeFalse();
    expect(component.pendingTaskId).toBeNull();
    expect(component.editForm.value.title).toBeNull();
  });

  it('should reset pendingTaskId on deleteTaskSuccess', () => {
    component.pendingTaskId = 'mock-id';

    mockActions$.next(deleteTaskSuccess({ id: 'mock-id' }));

    expect(component.pendingTaskId).toBeNull();
  });
});
