import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Basket } from 'src/app/Model/Basket';
import { OrderService } from '../../../service/order.service';

@Component({
  selector: 'app-bascket',
  templateUrl: './bascket.component.html',
  styleUrls: ['./bascket.component.css']
})
export class BascketComponent {
  basket: Basket;

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
