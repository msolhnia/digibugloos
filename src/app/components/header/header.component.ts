import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/auth/auth.service';
import { FetchdataService } from 'src/app/Service/fetchdata.service';
import { OrderService } from 'src/app/Service/order.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cetegoryList: any;//
  badgeHidden: boolean = true;
  badgeCount: number;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(public fetchData: FetchdataService,
    private orderSrv: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
    this.getCategory();
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
    });
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

  logout() {
    this.authService.logout();
    this.userSub.unsubscribe();
    this.router.navigate(['/'], { relativeTo: this.route });
  }

  prepareLogIn() {
    this.router.navigate(['/auth'], { relativeTo: this.route });
  }
  goHome()
  {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

}
