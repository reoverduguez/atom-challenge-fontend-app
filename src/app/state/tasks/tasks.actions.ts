import { createAction, props } from '@ngrx/store';

import { ApiErrorResponse } from '../../shared/models/api-responses.model';
import { Task } from '../../shared/models/task.model';

export const loadTasks = createAction('[Tasks] Load Tasks', props<{ userId: string }>());
export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Task[] }>(),
);
export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>(),
);

export const loadTask = createAction('[Tasks] Load Task', props<{ id: string }>());
export const loadTaskSuccess = createAction('[Tasks] Load Task Success', props<{ task: Task }>());
export const loadTaskFailure = createAction(
  '[Tasks] Load Task Failure',
  props<{ error: string }>(),
);

export const createTask = createAction(
  '[Tasks] Create Task',
  props<{ task: Omit<Task, 'id' | 'createdAt'> }>(),
);
export const createTaskSuccess = createAction(
  '[Tasks] Create Task Success',
  props<{ task: Task }>(),
);
export const createTaskFailure = createAction(
  '[Tasks] Create Task Failure',
  props<{ error: ApiErrorResponse }>(),
);

export const updateTask = createAction('[Tasks] Update Task', props<{ task: Partial<Task> }>());
export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: Task }>(),
);
export const updateTaskFailure = createAction(
  '[Tasks] Update Task Failure',
  props<{ error: string }>(),
);

export const deleteTask = createAction('[Tasks] Delete Task', props<{ id: string }>());
export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: string }>(),
);
export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>(),
);
