import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Basket } from 'src/app/Model/Basket';
import { basketService } from 'src/app/service/basket.service';

@Component({
  selector: 'app-bascket',
  templateUrl: './bascket.component.html',
  styleUrls: ['./bascket.component.css']
})
export class BascketComponent {
  basket: Basket;

  constructor(public basketService: basketService, private router: Router,
    private route: ActivatedRoute,) {

    this.basketService.basketChanged.subscribe(
      (basket) => {
        this.basket = basket;
      }
    )
  }

  onClearBasket() {
    this.basketService.clearBasket();
  }


  onOpenOrder() {
    this.router.navigate(['/confirmorder'], { relativeTo: this.route });
  }

}
