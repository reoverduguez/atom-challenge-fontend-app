import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { environment } from '../../../environments/environment';
import { Task } from '../../shared/models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks for a user', () => {
    const owner = 'user-123';
    const mockTasks: Task[] = [
      {
        id: 'mock-id',
        title: 'mock title',
        description: 'mock description',
        owner,
        completed: false,
        createdAt: new Date(),
      },
    ];

    service.getTasks(owner).subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${baseUrl}/task/user/${owner}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a task', () => {
    const newTask = {
      title: 'New Task',
      completed: false,
      description: 'mock description',
    } as Omit<Task, 'id' | 'createdAt'>;
    const createdTask: Task = {
      id: 'mock-id',
      ...newTask,
      owner: 'mock owner',
      createdAt: new Date(),
    };

    service.createTask(newTask).subscribe((task) => {
      expect(task).toEqual(createdTask);
    });

    const req = httpMock.expectOne(`${baseUrl}/task`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(createdTask);
  });

  it('should update a task', () => {
    const taskId = 'mock-id';
    const updates = { title: 'Updated Task', completed: true };
    const updatedTask: Task = {
      id: taskId,
      title: 'Updated Task',
      owner: 'user-123',
      completed: true,
      description: 'mock description',
      createdAt: new Date(),
    };

    service.updateTask(taskId, updates).subscribe((task) => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${baseUrl}/task/${taskId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updates);
    req.flush(updatedTask);
  });

  it('should remove a task', () => {
    const taskId = 'mock-id';
    const responseMessage = 'Task deleted';

    service.removeTask(taskId).subscribe((res) => {
      expect(res).toBe(responseMessage);
    });

    const req = httpMock.expectOne(`${baseUrl}/task/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(responseMessage);
  });
});
