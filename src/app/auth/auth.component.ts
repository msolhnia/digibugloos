import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { loginModel, UserProfileModel } from '../model/appModel';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  UserProfile:UserProfileModel;
  login:loginModel;
  constructor(private authService: AuthService, private router: Router) {
    this.login= new loginModel();
    this.UserProfile=new UserProfileModel();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onReset()
  {
    this.login= new loginModel();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }


    const email = this.login.email;
    const password = this.login.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {        
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      errorMessage => {

        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
