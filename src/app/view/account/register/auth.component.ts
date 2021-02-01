import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, NgModel, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService} from 'src/app/service/auth.service';
import { ViewChild } from '@angular/core';
import { Validation } from 'src/app/validation/validation.service';
import { UserProfile } from 'src/app/Model/UserProfile';
import { Login } from 'src/app/Model/Login';
import { AuthResponseData } from 'src/app/Interface/AuthResponseData';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  error: string = null;
  UserProfile: UserProfile;
  login: Login;
  signup: Login;
  inProgress: boolean;
  hide = true;
  confirm: NgModel;
  password: NgModel;
  isLoading=false;

  @ViewChild('signUpForm') public signUpForm: NgForm;

  constructor(
    private authService: AuthService, private router: Router,
    private route: ActivatedRoute,    
    private http: HttpClient) {
    this.login = new Login();
    this.signup = new Login();
    this.UserProfile = new UserProfile();
  }

  onResetLoglin() {
    this.login = new Login();
  }


  onResetSignUp() {
    this.UserProfile = new UserProfile();
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

