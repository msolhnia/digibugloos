import { Component, OnInit } from '@angular/core';
import { basketModel, orderModel, status } from 'src/app/model/appModel';
import { OrderService } from 'src/app/Service/order.service';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  basket: basketModel;
  totalprice: number = 0;
  order: orderModel;
  constructor(private orderService: OrderService) {
    this.basket = new basketModel();
    this.order= new orderModel();
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
    //clear nuused data, we don need to body(description) of a product in basket 
    this.order.items=this.basket.items.map((item)=> {item.Body=""; return item;});
    this.order.price = this.getTotalCost(this.basket.items);
    this.order.status = status.received;
    this.orderService.saveOrder(this.order);
  }

}
