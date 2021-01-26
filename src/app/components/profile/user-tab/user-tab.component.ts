import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
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
  readonly:boolean=true;
  constructor(
    private authService: AuthService, private router: Router,
    private route: ActivatedRoute,    
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.UserProfile = new UserProfileModel();

    this.authService.appProfile.subscribe(
      
      UserProfile=>{this.UserProfile =UserProfile[0];
        console.log(UserProfile);
      }
    );
  }


  onSignUp(form: NgForm) {
    if (!form.valid) { return; }


    this.router.navigate(['/'], { relativeTo: this.route });
  }

  onEditmode()
  {
    this.readonly=false;
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
