import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';

import { createTask, createTaskSuccess } from '../../../state/tasks/tasks.actions';
import { selectTasksLoading } from '../../../state/tasks/tasks.selectors';
import { TaskState } from '../../../state/tasks/tasks.state';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatProgressSpinnerModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatLabel,
    MatIcon,
    MatInput,
    MatDialogClose,
    MatButton,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css',
})
export class AddTaskDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly store = inject(Store<TaskState>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly actions$ = inject(Actions);

  private readonly loading$ = this.store.select(selectTasksLoading);
  private readonly destroy$ = new Subject<void>();

  public loading = false;
  public taskForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  public ngOnInit(): void {
    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => (this.loading = loading));
    this.actions$.pipe(ofType(createTaskSuccess), take(1)).subscribe(() => this.dialogRef.close());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public createTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { title, description } = this.taskForm.value;

    if (!title || !description || !this.auth.currentUser?.uid) {
      return;
    }

    const newTask: Omit<Task, 'id' | 'createdAt'> = {
      title,
      description,
      completed: false,
      owner: this.auth.currentUser?.uid,
    };

    this.store.dispatch(createTask({ task: newTask }));
  }
}
