import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // Inject Router here
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password)
        .then(() => {
          console.log('Registration Success');
          this.router.navigate(['/verify-email']); // Navigate to verification page
        })
        .catch(error => console.error('Registration Failure', error));
    }
  }

  // Helper method to get form control for template
  get f() {
    return this.registerForm.controls;
  }
}
