import { Component } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  movies: Movie[] = [];
  error = '';
  omdbResults: Movie[] = [];
  searchTitle = '';
  searching = false;
  selectedMovie: Movie | null = null;

  constructor(private MovieService: MovieService) {}

  ngOnInit() {
    this.MovieService.getAll().subscribe({
      next: (movies) => (this.movies = movies),
      error: (err) => (this.error = err)
    });
  }

  searchOmdb() {
    if (!this.searchTitle.trim()) return;
    this.searching = true;
    this.MovieService.searchOmdb(this.searchTitle).subscribe({
      next: (res) => {
        this.omdbResults = (res.Search || []).map((m: any) => ({
          title: m.Title,
          year: m.Year,
          imdbID: m.imdbID,
          type: m.Type,
          poster: m.Poster
        }));
        this.searching = false;
      },
      error: (err) => {
        this.error = 'Failed to search OMDB';
        this.searching = false;
      }
    });
  }

  addMovieFromOmdb(movie: any) {
    this.MovieService.create({
      title: movie.Title,
      year: movie.Year,
      imdbID: movie.imdbID,
      type: movie.Type,
      poster: movie.Poster
    } as Movie).subscribe({
      next: (newMovie) => {
        this.movies.push(newMovie);
        this.omdbResults = [];
        this.searchTitle = '';
      },
      error: (err) => {
        this.error = 'Failed to add movie';
      }
    });
  }

  showMovieInfo(movie: Movie) {
    this.selectedMovie = movie;
  }

  closeMovieInfo() {
    this.selectedMovie = null;
  }

  removeMovie(movie: Movie) {
    if (!movie._id) return;
    this.MovieService.delete(movie._id).subscribe({
      next: () => {
        this.movies = this.movies.filter(m => m._id !== movie._id);
      },
      error: () => {
        this.error = 'Failed to remove movie';
      }
    });
  }
}
