import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfileModel } from 'src/app/model/appModel';
import { Validation } from 'src/app/Service/validation.service';

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.css']
})
export class UserTabComponent implements OnInit {
  UserProfile: UserProfileModel;
  readonly: boolean = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService, private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {

    this.UserProfile = new UserProfileModel();
  }

  ngOnInit(): void {
    this.authService.appProfile.subscribe(
      UserProfile => {
        if (UserProfile[0]) {
          this.UserProfile = UserProfile[0];
        }
      }
    );
    if (this.authService.appProfileStatic && this.authService.appProfileStatic[0]) {
      this.UserProfile = this.authService.appProfileStatic[0];
    }
  }


  updateProfile() {
    this.authService.appProfileStatic = this.UserProfile;
    this.authService.updateProfile();


    this.authService.appProfile.subscribe(
      UserProfile => {
        if (UserProfile[0]) {
          this.UserProfile = UserProfile[0];
        }
      }
    );

    this.openSnackBar("your profile updated successfuly", false);
    this.onEditmode();
  }



  openSnackBar(title: string, isAdded: boolean = true) {
    let message = (isAdded) ? " added to card!" : "";
    this._snackBar.open(title + message, "ok", {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
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
