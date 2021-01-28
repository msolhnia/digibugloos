import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { basketModel } from 'src/app/model/appModel';
import { OrderService } from '../../Service/order.service';

@Component({
  selector: 'app-bascket',
  templateUrl: './bascket.component.html',
  styleUrls: ['./bascket.component.css']
})
export class BascketComponent {
  basket: basketModel;

  constructor(public orderSrv: OrderService, private router: Router,
    private route: ActivatedRoute,) {


    this.orderSrv.basketChanged.subscribe(
      (basket) => {
        this.basket = basket;
      }
    )

  }


  onClearBasket() {
    this.orderSrv.clearBasket();
  }


  onOpenOrder() {
    console.log("order");
    this.router.navigate(['/confirmorder'], { relativeTo: this.route });
  }

}
