import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { RegisterComponent } from './pages/register/register.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'user', component: UserComponent },
    { path: 'movies', component: MovieListComponent },
    { path: 'movies/:id', component: MovieDetailComponent },
    { path: 'register', component: RegisterComponent }
];
