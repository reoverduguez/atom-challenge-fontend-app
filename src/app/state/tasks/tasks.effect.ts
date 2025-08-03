import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import {
  loadTasks,
  loadTasksSuccess,
  loadTasksFailure,
  createTask,
  createTaskSuccess,
  createTaskFailure,
  //   updateTask,
  //   updateTaskSuccess,
  //   updateTaskFailure,
  //   deleteTask,
  //   deleteTaskSuccess,
  //   deleteTaskFailure,
} from './tasks.actions';
import { TaskService } from '../../services/task/task.service';
import { ApiErrorResponse } from '../../shared/models/api-responses.model';

@Injectable()
export class TasksEffects {
  private taskService = inject(TaskService);
  private actions$ = inject(Actions);

  constructor() {}

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      mergeMap(({ userId }) =>
        this.taskService.getTasks(userId).pipe(
          map((tasks) => loadTasksSuccess({ tasks })),
          catchError((error) => of(loadTasksFailure({ error }))),
        ),
      ),
    ),
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTask),
      mergeMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((task) => createTaskSuccess({ task })),
          catchError((err: HttpErrorResponse) => {
            const error = err.error as ApiErrorResponse;
            return of(createTaskFailure({ error }));
          }),
        ),
      ),
    ),
  );

  //   updateTask$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(updateTask),
  //       mergeMap(({ task }) =>
  //         this.taskService.update(task).pipe(
  //           map(() => updateTaskSuccess({ task })),
  //           catchError((error) => of(updateTaskFailure({ error }))),
  //         ),
  //       ),
  //     ),
  //   );

  //   deleteTask$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(deleteTask),
  //       mergeMap(({ id }) =>
  //         this.taskService.delete(id).pipe(
  //           map(() => deleteTaskSuccess({ id })),
  //           catchError((error) => of(deleteTaskFailure({ error }))),
  //         ),
  //       ),
  //     ),
  //   );
}
