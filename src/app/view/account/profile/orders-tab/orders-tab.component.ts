
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { orderService } from 'src/app/service/order.service';
import { DialogComponent } from 'src/app/view/account/profile/orders-tab/orderDetails/dialog.component'
import { Order } from 'src/app/Model/Order';
import { OrderView } from 'src/app/Model/OrderView';
import { authService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-orders-tab',
  templateUrl: './orders-tab.component.html',
  styleUrls: ['./orders-tab.component.css']
})
export class OrdersTabComponent {
  displayedColumns: string[] = ['price', 'products', 'description', 'status', 'View'];
  orders: Order[] = [];
  orderViews: OrderView[] = [];

  @ViewChild('MatPaginator') paginator: MatPaginator;
  dataSource: any;
  constructor(private orderService: orderService, private dialog: MatDialog, private authService: authService) 
  {
    this.orderService.orderChanged.subscribe(
      orders => {
        let orderView = new OrderView();
        this.orderViews = orderView.ordersToOrderViews(orders);
        this.dataSource = new MatTableDataSource<OrderView>(this.orderViews);
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = 10;
      }
    );
  }

  viewDetail(order: any) {
    const dialogRef = this.dialog.open(DialogComponent, {data: {list: order}});
  }

}
