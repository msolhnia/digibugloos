import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/model/classes/UserProfile';
import { AuthService } from 'src/app/Service/auth.service';
import { Validation } from 'src/app/Service/validation.service';

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.css']
})
export class UserTabComponent implements OnInit {
  UserProfile: UserProfile;
  readonly: boolean = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private _snackBar: MatSnackBar,
    private authService: AuthService, private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {

    this.UserProfile = new UserProfile();

    this.authService.profile.subscribe
    (
      (profile) => 
      {
        if (profile[0]) {                  
          this.UserProfile =profile[0];
        }
      }
    );
  }

  ngOnInit(): void {
  }


  updateProfile() {
    this.authService.updateProfile(this.UserProfile);
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
