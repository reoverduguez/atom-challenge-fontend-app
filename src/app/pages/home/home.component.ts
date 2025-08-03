/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

import { AddTaskDialogComponent } from '../../shared/components/add-task-dialog/add-task-dialog.component';
import { createTaskFailure, loadTasks } from '../../state/tasks/tasks.actions';
import { selectAllTasks } from '../../state/tasks/tasks.selectors';
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

  private readonly destroy$ = new Subject<void>();

  public readonly tasks$ = this.store.select(selectAllTasks);
  public readonly displayedColumns: string[] = ['title', 'description', 'createdAt', 'completed'];

  public ngOnInit(): void {
    this.loadUserTasks();
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
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addTask(): void {
    this.dialog.open<AddTaskDialogComponent>(AddTaskDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '500px',
    });
  }

  private loadUserTasks(): void {
    if (!this.auth.currentUser?.uid) {
      return;
    }
    this.store.dispatch(loadTasks({ userId: this.auth.currentUser.uid }));
  }
}
