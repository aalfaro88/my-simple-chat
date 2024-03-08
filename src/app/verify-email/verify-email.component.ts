import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  standalone: true,
})
export class VerifyEmailComponent {
  verifyForm: FormGroup;
  username: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private activatedRoute: ActivatedRoute // Inject ActivatedRoute here
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.username = params['username'];
    });

    this.verifyForm = this.fb.group({
      code: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      const { code } = this.verifyForm.value;
      if (this.username) {
        this.authService.confirmEmail(this.username, code)
          .then(() => {
            console.log('Email verified successfully');
            this.router.navigate(['/chat-room']); 
          })
          .catch((error) => {
            console.error('Verification error:', error);
          });
      } else {
        console.error('Username is null');
      }
    }
  }
}
