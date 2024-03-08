import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, private ngZone: NgZone) {
    this.isLoggedIn$ = authService.isLoggedIn;

    // Subscribe to isLoggedIn$ observable and use NgZone to run change detection
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.ngZone.run(() => {
        console.log("Authentication status changed to: ", isLoggedIn);
      });
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
