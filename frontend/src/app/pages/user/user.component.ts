import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

interface MovieList {
  _id: string;
  name: string;
  movies: any[];
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userId = localStorage.getItem('userId') || '';
  movieLists: MovieList[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchMovieLists();
  }

  fetchMovieLists() {
    this.loading = true;
    this.http.get<MovieList[]>(`${environment.apiUrl}/users/${this.userId}/lists`).subscribe({
      next: lists => {
        this.movieLists = lists;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load movie lists';
        this.loading = false;
      }
    });
  }

  goToMovieList(list: MovieList) {
    this.router.navigate(['/movies'], { queryParams: { listId: list._id } });
  }

  createList() {
    const name = prompt('Enter a name for your new movie list:');
    if (!name) return;

    // Check if list name already exists
    if (this.movieLists.some(list => list.name.toLowerCase() === name.toLowerCase())) {
      this.error = 'A list with this name already exists';
      return;
    }

    this.http.post<MovieList>(`${environment.apiUrl}/users/${this.userId}/lists`, { name }).subscribe({
      next: list => {
        this.movieLists.push(list);
        this.goToMovieList(list);
      },
      error: () => (this.error = 'Failed to create list')
    });
  }

  deleteList(list: MovieList) {
    if (confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
      this.authService.deleteMovieList(this.userId, list._id).subscribe({
        next: () => {
          this.movieLists = this.movieLists.filter(l => l._id !== list._id);
        },
        error: () => (this.error = 'Failed to delete list')
      });
    }
  }
} 