import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiBaseUrl;

  public getTasks(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/task/user/${userId}`);
  }

  public createTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/task`, { ...task });
  }

  public updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/task/${id}`, { ...task });
  }

  public removeTask(taskId: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/task/${taskId}`, {
      responseType: 'text' as const,
    });
  }
}
