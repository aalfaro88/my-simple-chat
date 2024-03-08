import { Injectable } from '@angular/core';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  ISignUpResult,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPool = new CognitoUserPool({
    UserPoolId: 'us-east-2_v8c1ozgys',
    ClientId: '4tgb7s8376tsk7ia14svhcdvm6',
  });
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private router: Router, private ngZone: NgZone) {}

  get isLoggedIn(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  setLoggedIn(loggedIn: boolean): void {
    this.authStatus.next(loggedIn);
    if(loggedIn) {
      const expiresIn = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
      const expirationDate = new Date(new Date().getTime() + expiresIn);
      localStorage.setItem('token_expiration', expirationDate.toISOString());
    } else {
      localStorage.removeItem('token_expiration');
    }
  }

  register(username: string, email: string, password: string): Promise<ISignUpResult> {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ];
  
    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, attributeList, [], (err, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Unknown error'));        
        }
      });
    });
  }
  

// Inside AuthService

login(username: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.ngZone.run(() => { // Wrap the entire login logic in ngZone
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const userData = {
        Username: username,
        Pool: this.userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          console.log("Login successful, updating auth status...");

          // Update local storage and authStatus BehaviorSubject
          const expiresIn = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
          const expirationDate = new Date(new Date().getTime() + expiresIn);
          localStorage.setItem('token_expiration', expirationDate.toISOString());
          this.authStatus.next(true);

          // Navigate to the chat-room route (optional)
          // this.router.navigate(['/chat-room']);

          resolve(session);
        },
        onFailure: (err) => {
          console.error("Login failed:", err);
          reject(err);
        },
      });
    });
  });
}


  confirmEmail(username: string, code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: this.userPool,
      });

      cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result); // "SUCCESS"
        }
      });
    });
  }

  resendVerificationCode(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: this.userPool,
      });

      cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result); // Success message or similar
        }
      });
    });
  }

  isAuthenticated(): boolean {
    const expiration = localStorage.getItem('token_expiration');
    const now = new Date();
    return !!expiration && new Date(expiration) > now;
  }

  logout(): void {
    localStorage.removeItem('token_expiration'); 
    this.authStatus.next(false);
    this.router.navigate(['/login']); 
  }
    
}
