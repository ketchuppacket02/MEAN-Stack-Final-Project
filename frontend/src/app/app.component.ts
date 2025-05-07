import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, RouterModule]
})
export class AppComponent {
  title = 'filmfriend';
  showNavbar = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEndEvent = event as NavigationEnd;
      this.showNavbar = !['/login', '/register'].some(path => navEndEvent.urlAfterRedirects.includes(path));
    });
  }
}
