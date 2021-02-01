import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Basket } from 'src/app/Model/Basket';
import { Order } from 'src/app/Model/Order';
import { OrderStatus } from 'src/app/Model/OrderStatus';
import { OrderService } from 'src/app/service/order.service';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  basket: Basket;
  totalprice: number = 0;
  order: Order;
  constructor(private orderService: OrderService,private route: ActivatedRoute, private router: Router) {
    this.basket = new Basket();
    this.order= new Order();
    this.basket = this.orderService.basket;
    this.totalprice = this.getTotalCost(this.basket.items);
  }

  getTotalCost(basketItems) {
    return basketItems.reduce((result, item) => item.count * item.price + result, 0);
  }

  ngOnInit(): void {

  }

  onCountChanged(value) {
    this.totalprice = this.getTotalCost(this.basket.items);
  }


  saveOrder() {
    //clear nuused data, we dont need to save body(description) of a product in basket 
    this.order.items=this.basket.items.map((item)=> {item.body=""; return item;});
    this.order.price = this.getTotalCost(this.basket.items);
    this.order.status = OrderStatus.received;    
    this.orderService.saveOrder(this.order);
    this.orderService.clearBasket();
    this.router.navigate(['/profile'], { relativeTo: this.route });
  }

}
