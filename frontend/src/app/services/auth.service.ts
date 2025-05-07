import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface TokenResponse {
  token: string;
}

export interface User {
  _id: string;
  username: string;
}

export interface MovieList {
  name: string;
  movies: any[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private api = '/api/users';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.api}/register`, { username, password }).pipe(
      tap(user => localStorage.setItem('userId', user._id))
    );
  }

  /** Real HTTP call for login, expects user object with _id */
  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, { username, password }).pipe(
      tap(user => localStorage.setItem('userId', user._id))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
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

  deleteMovieList(userId: string, listId: string): Observable<any> {
    return this.http.delete(`${this.api}/${userId}/lists/${listId}`);
  }
}
