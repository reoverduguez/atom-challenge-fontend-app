/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

import { AddTaskDialogComponent } from '../../shared/components/add-task-dialog/add-task-dialog.component';
import { Task } from '../../shared/models/task.model';
import {
  createTaskFailure,
  deleteTask,
  deleteTaskFailure,
  deleteTaskSuccess,
  loadTasks,
  updateTask,
  updateTaskFailure,
  updateTaskSuccess,
} from '../../state/tasks/tasks.actions';
import { selectAllTasks, selectTasksLoading } from '../../state/tasks/tasks.selectors';
import { TaskState } from '../../state/tasks/tasks.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store<TaskState>);
  private readonly actions$ = inject(Actions);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(Auth);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  public readonly loading$ = this.store.select(selectTasksLoading).pipe(takeUntil(this.destroy$));
  public readonly tasks$ = this.store.select(selectAllTasks).pipe(takeUntil(this.destroy$));
  public readonly editForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    completed: [false],
  });
  public readonly displayedColumns: string[] = [
    'title',
    'description',
    'createdAt',
    'completed',
    'action',
  ];

  public loading = false;
  public editMode = false;
  public pendingTaskId: string | null = null;

  public ngOnInit(): void {
    this.loadUserTasks();

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.actions$
      .pipe(ofType(createTaskFailure), takeUntil(this.destroy$))
      .subscribe(({ error }) => {
        console.error(error);
        const message = `❌ Failed to create task: ${error.error}`;
        this.snackBar.open(message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });

    this.actions$
      .pipe(ofType(deleteTaskFailure), takeUntil(this.destroy$))
      .subscribe(({ error }) => {
        console.error(error);
        const message = `❌ Failed to delete task: ${error.error}`;
        this.snackBar.open(message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });

    this.actions$
      .pipe(ofType(updateTaskFailure), takeUntil(this.destroy$))
      .subscribe(({ error }) => {
        console.error(error);
        const message = `❌ Failed to update task: ${error.error}`;
        this.snackBar.open(message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });

    this.actions$.pipe(ofType(updateTaskSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.pendingTaskId = null;
      this.editMode = false;
      this.editForm.reset();
    });

    this.actions$.pipe(ofType(deleteTaskSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.pendingTaskId = null;
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addTask(): void {
    if (this.loading) {
      return;
    }
    this.dialog.open<AddTaskDialogComponent>(AddTaskDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '500px',
    });
  }

  public editTask(task: Task): void {
    this.pendingTaskId = task.id;
    this.editForm.patchValue({
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
    this.editMode = true;
  }

  public cancelEdit(task: Task): void {
    this.editMode = false;
    this.pendingTaskId = null;
    this.editForm.patchValue({
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
  }

  public saveTask(taskId: string): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const { title, description, completed } = this.editForm.value;
    if (!title || !description || completed === null) {
      return;
    }
    this.store.dispatch(
      updateTask({
        id: taskId,
        task: {
          title,
          description,
          completed,
        },
      }),
    );
  }

  public deleteTask(id: string): void {
    if (this.loading) {
      return;
    }
    this.pendingTaskId = id;
    this.store.dispatch(deleteTask({ id }));
  }

  public exit(): void {
    if (this.loading) {
      return;
    }
    signOut(this.auth)
      .then(() => this.router.navigate(['/login']))
      .catch((err) => {
        const message = `❌ Failed to logout: ${err}`;
        this.snackBar.open(message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  public checkboxToggle(taskId: string, event: MatCheckboxChange): void {
    if (this.loading) {
      return;
    }
    this.pendingTaskId = taskId;
    this.store.dispatch(
      updateTask({
        id: taskId,
        task: {
          completed: event.checked,
        },
      }),
    );
  }

  private loadUserTasks(): void {
    if (!this.auth.currentUser?.uid) {
      return;
    }
    this.store.dispatch(loadTasks({ userId: this.auth.currentUser.uid }));
  }
}
