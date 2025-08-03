import { createFeatureSelector, createSelector } from '@ngrx/store';

import { taskAdapter, TaskState } from './tasks.state';

export const selectTasksState = createFeatureSelector<TaskState>('tasks');

const { selectAll, selectEntities, selectTotal } = taskAdapter.getSelectors();

export const selectAllTasks = createSelector(selectTasksState, selectAll);

export const selectTasksEntities = createSelector(selectTasksState, selectEntities);

export const selectTasksTotal = createSelector(selectTasksState, selectTotal);

export const selectTasksLoading = createSelector(selectTasksState, (state) => state.loading);
