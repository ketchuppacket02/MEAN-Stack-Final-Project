import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface TokenResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private api = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/register`, { username, password });
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.api}/login`,
      { username, password }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  signup(username: string): Observable<any> {
    return this.http.post('/api/users', { username });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserFromToken(): { id: string; username: string } | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
}
}
