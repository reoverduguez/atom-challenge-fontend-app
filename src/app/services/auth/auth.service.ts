import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthResponse } from '../../shared/models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/auth';

  constructor() {}

  public login(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}`, { email });
  }

  public register(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email });
  }
}
