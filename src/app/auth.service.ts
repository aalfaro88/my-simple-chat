import { Injectable } from '@angular/core';
import { CognitoUserPool, AuthenticationDetails, CognitoUser, ISignUpResult, CognitoUserAttribute } from 'amazon-cognito-identity-js';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPool = new CognitoUserPool({
    UserPoolId: 'us-east-2_v8c1ozgys',
    ClientId: '4tgb7s8376tsk7ia14svhcdvm6',
  });

  constructor() {}

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

}
