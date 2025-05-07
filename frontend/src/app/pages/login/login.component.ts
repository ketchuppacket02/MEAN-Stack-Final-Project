import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Login form submitted');
    if (this.loginForm.invalid) {
      this.errorMsg = "Both fields are required";
      console.log('Form invalid:', this.loginForm.value);
      return;
    }
    const { username, password } = this.loginForm.value;
    console.log('Attempting login with:', username);
    this.authService.login(username, password).subscribe({
      next: response => {
        console.log('Login response:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          const user = this.authService.getUserFromToken();
          console.log('Decoded user from token:', user);
          if (user) {
            localStorage.setItem('userId', user.id);
            this.router.navigate(['/user']);
          } else {
            this.errorMsg = 'Login failed: invalid token.';
            console.log('Invalid token received');
          }
        } else {
          this.errorMsg = 'Login failed: no token in response.';
          console.log('No token in response:', response);
        }
      },
      error: (err) => {
        this.errorMsg = 'Login failed, try again.';
        console.log('Login error:', err);
      }
    });
  }
}
