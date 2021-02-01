import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserProfile } from 'src/app/Model/UserProfile';
import { AuthService } from 'src/app/service/auth.service';
import { FetchdataService } from 'src/app/service/fetchData.service';
import { OrderService } from 'src/app/service/order.service';

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

  profile: UserProfile;


  constructor(public fetchData: FetchdataService,
    private orderSrv: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
    this.getCategory();
    this.profile = new UserProfile();
  }

  ngOnInit(): void {
    this.orderSrv.basketChanged.subscribe(basket => {
      if (basket != null && basket.items != null && basket.items.length > 0) {
        this.badgeCount = basket.items.length;
        this.badgeHidden = false;
      }
      else {
        this.badgeHidden = true;
      }
    });


    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user; 
      console.log("fire");  
      console.log(this.isAuthenticated);  

      if (!this.isAuthenticated) { this.profile = null; console.log("this appProfile is null");   }
    });

    this.authService.isAuthenticated.subscribe(a => {
      this.isAuthenticated = a;
      if (!this.isAuthenticated) { this.profile = null; console.log("this appProfile is null");   }
    });

    this.profileSub = this.authService.profile.subscribe(profile => {           
      if(profile!=null)
      {        
        if(!<UserProfile>profile[0])
        {
          this.profile=profile;
        }
        else
        {
          this.profile = <UserProfile>profile[0];
        }
      }      
    });

    this.authService.username.subscribe(
      username => {
        if (username.length) {
          this.profileSub = this.authService.loadProfile(username).subscribe(appProfile => {
            this.profile = appProfile[0]; 
          });
        }
      })
  }


  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.profileSub.unsubscribe();
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
    //this.router.navigate(['/profile'], { relativeTo: this.route });
    this.redirectTo('/profile');
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
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
