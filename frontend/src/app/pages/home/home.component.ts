import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink }from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username = '';
  myMovies: Movie[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const me = this.authService.getUserFromToken();
    if (!me) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = me.username;
    this.movieService.getMyMovies(me.id).subscribe(list => {
      this.myMovies = list;
    });
  }
}
