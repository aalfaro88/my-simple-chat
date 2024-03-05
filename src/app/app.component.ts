// app.component.ts
import { Component, NgModule } from '@angular/core';
import { NgIf } from '@angular/common';
import { LoginComponent } from './login/login.component'; // Adjust path as needed
import { RegisterComponent } from './register/register.component'; // Adjust path as needed
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf, // Import NgIf here
    RouterOutlet,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'simple-chat';
  isLoggedIn = false;
  showLogin = true;

  handleLoggedIn() {
    this.isLoggedIn = true;
  }

  toggleForm() {
    this.showLogin = !this.showLogin;
    console.log('Toggled showLogin to:', this.showLogin); // Debugging output
  }
  
}
