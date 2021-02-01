
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/Service/order.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component'
import { Order } from 'src/app/model/classes/Order';
import { OrderView } from 'src/app/model/classes/OrderView';
import { AuthService } from 'src/app/Service/auth.service';
import { OrderStatus } from 'src/app/model/classes/OrderStatus';


@Component({
  selector: 'app-orders-tab',
  templateUrl: './orders-tab.component.html',
  styleUrls: ['./orders-tab.component.css']
})
export class OrdersTabComponent implements  AfterViewInit {
  columns = [];
  displayedColumns = this.columns.map(c => c.columnDef);
  orders: Order[] = [];
  orderViews: OrderView[]=[];

  @ViewChild('MatPaginator') paginator: MatPaginator;
  dataSource: any;
  constructor(private orderService: OrderService,private dialog: MatDialog,
    private authService: AuthService) {
    this.DynamicColumns();  
  } 

  getOrder() {
    this.authService.user.subscribe(
      (user)=>
      {
        console.log("x1");
        if(user)
        {
          console.log("x2");
          this.orderService.getOrders(user.email).subscribe(
            orders=>{ 
              console.log("x3");
              console.log(orders);
              this.orders=orders;        
              let st = OrderStatus;
              let nf = new Intl.NumberFormat();
      
              this.orders.forEach(order => {
                let orderView=new OrderView();
                orderView.price=nf.format(Number(order.price));
                orderView.description=order.description;
                orderView.status=st[order.status];
                let itemList:string="";
                let itemIdList:string[][]=[];
                order.items.forEach(product => {           
                  itemList += product.title+"("+product.count+"),";
                });
                orderView.products=itemList;        
                order.items.forEach(product => {
                  let str:string[]=[];
                  str.push(product.id);
                  str.push(product.count);
                  itemIdList.push(str);
                });
      
                orderView.View=itemIdList;
                this.orderViews.push(orderView);
              });             
      
              this.DynamicColumns();
              this.dataSource = new MatTableDataSource<OrderView>(this.orderViews);
              this.dataSource.paginator = this.paginator;
              this.paginator.pageSize = 10;
            }
          );
        }
      }
    )

  }

  ngAfterViewInit(): void {
     this.getOrder();
  }

  DynamicColumns() {
    let el = new OrderView();
    var data_array = [];
    var keys = Object.keys(el)
    Object.keys(el).map((key, index) => {
      let my_object: any = {};
      my_object.columnDef = key;
      my_object.header = key=="price"?"Total Price":key;
      my_object.cell = (element: any) => eval("element." + key);
      data_array.push(my_object);
    });
    this.columns = data_array;
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }


   
  viewDetail(data:any)
   {
    const dialogRef = this.dialog.open(DialogComponent,{
      data:{
        list: data,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
     // console.log(result);
    });
  }

}
