// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ChatRoomComponent } from './chatapp/chat-room/chat-room.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'verify-email', component: VerifyEmailComponent, title: 'Verify Email' },
  { path: 'chat-room', component: ChatRoomComponent, canActivate: [AuthGuard], title: 'Chat Room' },
  { path: '', redirectTo: '/chat-room', pathMatch: 'full' },
];
