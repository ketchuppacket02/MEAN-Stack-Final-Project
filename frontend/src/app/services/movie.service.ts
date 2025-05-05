import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private base = '/api/movies';

  constructor (private http: HttpClient) { }

  getAll(): Observable<Movie[]> { 
    return this.http.get<Movie[]>(this.base);
  }
  
  getById(id: string):Observable<Movie> { 
    return this.http.get<Movie>(`${this.base}/${id}`);
  }
  
  create(movie: Movie): Observable<Movie> { 
    return this.http.post<Movie>(this.base, movie);
  }

  update(id: string, movie: Movie): Observable<Movie> { 
    return this.http.put<Movie>(`${this.base}/${id}`, movie);
  }

  delete(id: string): Observable<void> { 
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  searchOmdb(title: string) {
    return this.http.get<{Search: Movie[]}>(`/api/omdb/search?title=${encodeURIComponent(title)}`);
  }

}
