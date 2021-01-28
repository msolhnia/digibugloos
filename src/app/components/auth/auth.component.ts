import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, NgModel, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from 'src/app/Service/auth.service';

import { ViewChild } from '@angular/core';
import { Validation } from 'src/app/Service/validation.service';
import { UserProfileModel, loginModel } from 'src/app/model/appModel';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  error: string = null;
  UserProfile: UserProfileModel;
  login: loginModel;
  signup: loginModel;
  inProgress: boolean;
  hide = true;
  confirm: NgModel;
  password: NgModel;


  @ViewChild('signUpForm') public signUpForm: NgForm;

  constructor(
    private authService: AuthService, private router: Router,
    private route: ActivatedRoute,    
    private http: HttpClient) {
    this.login = new loginModel();
    this.signup = new loginModel();
    this.UserProfile = new UserProfileModel();


  }


  onResetLoglin() {
    this.login = new loginModel();
  }


  onResetSignUp() {
    this.UserProfile = new UserProfileModel();
  }


  onLogin(form: NgForm) {
    if (!form.valid) { return; }
    let authObs: Observable<AuthResponseData>;
    authObs = this.authService.login(this.login);
    authObs.subscribe(
      resData => {
        this.router.navigate(['/']);
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
    form.reset();
  }


  onSignUp(form: NgForm) {
    if (!form.valid) { return; }
    this.UserProfile.originalName = this.authService.correctUserName(this.signup.email, false);
    let authObs = this.authService.signup(this.signup, this.UserProfile);

    this.router.navigate(['/'], { relativeTo: this.route });
  }





  fullNameErrorHandler =
    {
      isErrorState: (control: FormControl) => Validation.checkLimit(control, 5, 100)
    }

  postalCodeErrorHandler =
    {
      isErrorState: (control: FormControl) => Validation.onlyDigit(control)
    }


  addressErrorHandler =
    {
      isErrorState: (control: FormControl) => Validation.checkLimit(control, 20, 200)
    }


  confirmPasswordErrorHandler =
    {
      isErrorState: (control: FormControl) => Validation.confirmPassword(control, this.signup.password)
    }

  emailErrorHandler =
    {
      isErrorState: (control: FormControl) => Validation.checkEmail(control)
    }


  passwordErrorHandler =
    {
      isErrorState: (control: FormControl) => Validation.checkPassword(control)
    }


}

