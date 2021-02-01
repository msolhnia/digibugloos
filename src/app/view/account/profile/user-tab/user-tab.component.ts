import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/Model/UserProfile';
import { alertService } from 'src/app/service/alert.service';
import { authService } from 'src/app/service/auth.service';
import { Validation } from 'src/app/validation/validation.service';

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.css']
})
export class UserTabComponent {
  UserProfile: UserProfile;
  readonly: boolean = true;

  constructor(
    private alertService: alertService,
    private authService: authService, private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {

    this.UserProfile = new UserProfile();

    //load profile when navigate to this page
    this.authService.profile.subscribe
    (
      (profile) => 
      {  
        if (profile && profile[0]) {                  
          this.UserProfile =profile[0];
        }
      }
    );

    //load profile when redirect to this page
    this.authService.usernameSubject.subscribe
    (
      (usernameSubject) => 
      {
        this.authService.loadProfile(usernameSubject).subscribe
        (
          (profile) => 
          {  
            if (profile && profile[0]) {                  
              this.UserProfile =profile[0];
            }
          }
        )        
      }
    );
  }


  updateProfile() {
    this.authService.updateProfile(this.UserProfile);
    this.alertService.openSnackBar("your profile updated successfuly", false);
    this.onEditmode();
  }

   onEditmode() {
    this.readonly = !this.readonly;
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


  emailErrorHandler =
    {
      isErrorState: (control: FormControl) => Validation.checkEmail(control)
    }
}
