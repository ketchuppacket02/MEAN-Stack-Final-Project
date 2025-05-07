import { Component } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  userId = '';
  listId = '';

  constructor(private MovieService: MovieService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.route.queryParams.subscribe(params => {
      this.listId = params['listId'] || '';
      if (this.userId && this.listId) {
        this.fetchMovies();
      }
    });
  }

  fetchMovies() {
    this.MovieService.getMoviesForList(this.userId, this.listId).subscribe({
      next: (movies) => (this.movies = movies),
      error: (err) => (this.error = 'Failed to load movies for this list')
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
    // First, create the movie in the DB if it doesn't exist
    this.MovieService.create({
      title: movie.Title,
      year: movie.Year,
      imdbID: movie.imdbID,
      type: movie.Type,
      poster: movie.Poster
    } as Movie).subscribe({
      next: (newMovie) => {
        // Type guard for newMovie._id
        if (!newMovie._id) {
          this.error = 'Movie creation failed: missing ID';
          return;
        }
        // Then, add it to this list
        this.MovieService.addMovieToList(this.userId, this.listId, newMovie._id).subscribe({
          next: () => {
            this.movies.push(newMovie);
            this.omdbResults = [];
            this.searchTitle = '';
          },
          error: () => {
            this.error = 'Failed to add movie to list';
          }
        });
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
    this.MovieService.removeMovieFromList(this.userId, this.listId, movie._id).subscribe({
      next: () => {
        this.movies = this.movies.filter(m => m._id !== movie._id);
      },
      error: () => {
        this.error = 'Failed to remove movie from list';
      }
    });
  }
}
