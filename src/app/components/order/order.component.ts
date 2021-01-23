import { Component, OnInit } from '@angular/core';
import { basketModel } from 'src/app/model/appModel';
import { OrderService } from 'src/app/Service/order.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  basket:basketModel;
  totalprice:number=0;

  constructor(private orderSrv:OrderService) {    
    this.basket=new basketModel();
    this.basket=this.orderSrv.basket;    
    
    this.orderSrv.ordersChanged.subscribe(
      (basket)=>{        
        this.totalprice=this.getTotalCost(basket.items);
      }
    );
   }

   getTotalCost(basketItems) 
   {    
    return basketItems.reduce((result, item) => item.count * item.price + result, 0); 
  }
 
  ngOnInit(): void {

  }

  onCountChanged(value)
  {
    this.totalprice=this.getTotalCost(this.basket.items);
  }

}
