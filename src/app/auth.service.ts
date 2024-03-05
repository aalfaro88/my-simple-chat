import { Injectable } from '@angular/core';
import { CognitoUserPool, AuthenticationDetails, CognitoUser, ISignUpResult, NodeCallback } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPool = new CognitoUserPool({
    UserPoolId: 'us-east-2_v8c1ozgys',
    ClientId: '4tgb7s8376tsk7ia14svhcdvm6',
  });

  constructor() {}

  register(username: string, password: string): Promise<ISignUpResult> {
    return new Promise((resolve, reject) => {
      // Adjust the callback's type annotations
      this.userPool.signUp(username, password, [], [], (err?: Error, result?: ISignUpResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(result as ISignUpResult); // Assert result as ISignUpResult to satisfy TypeScript
        }
      });
    });
  }

  login(username: string, password: string): Promise<any> {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err),
      });
    });
  }
}
