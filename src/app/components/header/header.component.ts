import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfileModel } from 'src/app/model/appModel';
import { FetchdataService } from 'src/app/Service/fetchdata.service';
import { OrderService } from 'src/app/Service/order.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cetegoryList: any;//
  badgeHidden: boolean = true;
  badgeCount: number;
  isAuthenticated = false;
  private userSub: Subscription;
  private profileSub: Subscription;

  appProfile: UserProfileModel;



  constructor(public fetchData: FetchdataService,
    private orderSrv: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
    this.getCategory();
    this.appProfile = new UserProfileModel();
  }

  ngOnInit(): void {
    this.orderSrv.ordersChanged.subscribe(basket => {
      if (basket.items != null && basket.items.length > 0) {
        this.badgeCount = basket.items.length;
        this.badgeHidden = false;
      }
      else {
        this.badgeHidden = true;
      }
    });


    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log("1");
      console.log(this.isAuthenticated);
    });

    this.authService.isAuthenticated.subscribe(a => {
      this.isAuthenticated = a;
      if (!this.isAuthenticated) { this.appProfile = null; }
      console.log("2");
    });

    this.profileSub = this.authService.appProfile.subscribe(appProfile => {           
      if(appProfile!=null)
      {        
        if(!<UserProfileModel>appProfile[0])
        {
          this.appProfile=appProfile;
        }
        else
        {
          this.appProfile = <UserProfileModel>appProfile[0];
        }
      }      
    });

    this.authService.username.subscribe(
      username => {
        if (username.length) {
          this.profileSub = this.authService.loadProfile(username).subscribe(appProfile => {
            this.appProfile = appProfile[0];
          });
        }
      })

  }


  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.profileSub.unsubscribe();
    //this.usernameSub.unsubscribe();
  }

  getCategory() {
    this.fetchData.allCategory.subscribe(Categories => {
      this.cetegoryList = Categories;
    }
    );
  }

  onMenuClick(id: number) {
    this.router.navigate(['/list', id], { relativeTo: this.route });
  }


  openProfile()
  {
    this.router.navigate(['/profile'], { relativeTo: this.route });
  }

  logout() {
    this.authService.logout();
    this.userSub.unsubscribe();
    this.router.navigate(['/'], { relativeTo: this.route });
  }

  prepareLogIn() {
    this.router.navigate(['/auth'], { relativeTo: this.route });
  }
  goHome() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

}
