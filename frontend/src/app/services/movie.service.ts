import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiRoot = 'http://localhost:3000/api'

  constructor(private http: HttpClient) { }

  getAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiRoot}/movies`);
  }

  getById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiRoot}/movies/${id}`);
  }

  searchOmdb(title: string): Observable<{ Search: Movie[] }> {
    const q = encodeURIComponent(title.trim());
    return this.http.get<{ Search: Movie[] }>(
      `${this.apiRoot}/omdb/search?title=${q}`
    );
  }

  create(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiRoot}/movies`, movie);
  }

  update(id: string, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(
      `${this.apiRoot}/movies/${id}`,
      movie
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiRoot}/movies/${id}`);
  }
  
  getMyMovies(userId: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(
      `${this.apiRoot}/users/${encodeURIComponent(userId)}/movies`
    );
  }
}
