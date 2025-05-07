import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Both fields are required';
      return;
    }
    
    const username = this.form.value.username!;
    const password = this.form.value.password!;
  
    this.auth.register(username, password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.error = err.error?.error || 'Registration failed'
    });

  }
}
