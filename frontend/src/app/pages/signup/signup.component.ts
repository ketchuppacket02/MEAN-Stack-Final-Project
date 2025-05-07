import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.errorMsg = 'Username is required';
      return;
    }
    const { username } = this.signupForm.value;
    this.authService.signup(username).subscribe({
      next: () => {
        this.successMsg = 'Signup successful! You can now log in.';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: () => (this.errorMsg = 'Signup failed, try again.')
    });
  }
} 