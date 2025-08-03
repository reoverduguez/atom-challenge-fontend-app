import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { Task } from '../../shared/models/task.model';

export interface TaskState extends EntityState<Task> {
  loading: boolean;
}

export const taskAdapter = createEntityAdapter<Task>({
  selectId: (task: Task) => task.id,
});

export const initialTaskState: TaskState = taskAdapter.getInitialState({
  loading: false,
});
