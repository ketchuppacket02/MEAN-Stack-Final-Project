import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private api = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/register`, { username, password });
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return of({ token: 'DUMMY_TOKEN' }).pipe(
      tap(res => localStorage.setItem('token', res.token))
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
}
