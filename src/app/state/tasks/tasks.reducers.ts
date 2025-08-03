/* eslint-disable no-empty-pattern */
import { createReducer, on } from '@ngrx/store';

import {
  createTask,
  createTaskFailure,
  createTaskSuccess,
  deleteTask,
  deleteTaskFailure,
  deleteTaskSuccess,
  loadTasksSuccess,
  updateTask,
  updateTaskFailure,
  updateTaskSuccess,
} from './tasks.actions';
import { initialTaskState, taskAdapter } from './tasks.state';

export const taskReducer = createReducer(
  initialTaskState,
  on(loadTasksSuccess, (state, { tasks }) =>
    taskAdapter.setAll(tasks, { ...state, loading: false }),
  ),

  on(createTask, (state, {}) => ({
    ...state,
    loading: true,
  })),
  on(createTaskFailure, (state, {}) => ({
    ...state,
    loading: false,
  })),
  on(createTaskSuccess, (state, { task }) =>
    taskAdapter.addOne(task, { ...state, loading: false }),
  ),

  on(updateTask, (state, {}) => ({
    ...state,
    loading: true,
  })),
  on(updateTaskSuccess, (state, { task }) =>
    taskAdapter.updateOne({ id: task.id, changes: task }, { ...state, loading: false }),
  ),
  on(updateTaskFailure, (state, {}) => ({
    ...state,
    loading: false,
  })),

  on(deleteTask, (state, {}) => ({
    ...state,
    loading: true,
  })),
  on(deleteTaskSuccess, (state, { id }) => taskAdapter.removeOne(id, { ...state, loading: false })),
  on(deleteTaskFailure, (state, {}) => ({
    ...state,
    loading: false,
  })),
);
