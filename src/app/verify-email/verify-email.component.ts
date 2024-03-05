import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Make sure to import ReactiveFormsModule

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  imports: [ReactiveFormsModule], // Add ReactiveFormsModule to the imports array
  standalone: true, // Ensure your component is marked as standalone
})
export class VerifyEmailComponent {
  verifyForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.verifyForm = this.fb.group({
      username: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      const { username, code } = this.verifyForm.value;
      this.authService.confirmEmail(username, code).then(() => {
        console.log('Email verified successfully');
        this.router.navigate(['/']); // Navigate to home or login page
      }).catch((error) => {
        console.error('Verification error:', error);
      });
    }
  }
}
