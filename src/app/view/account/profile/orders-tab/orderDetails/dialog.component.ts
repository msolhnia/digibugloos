import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderView } from 'src/app/Model/OrderView';
import { Search } from 'src/app/Model/Search';
import { fetchDataService } from 'src/app/service/fetchData.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent{
isloading:Boolean=true;
  productList: any;
  search: Search;
  orderList: OrderView;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialogRef: MatDialogRef<DialogComponent>, public fetchData: fetchDataService) {

    this.orderList = new OrderView();
    this.search= new Search();
    if (data) {
      this.orderList = data.list || this.orderList;
      let idList: string[] = [];
      let countList: string[] = [];     
       idList = this.orderList.View.map(f=>f[0]).filter(id=>id.length>0);
       countList = this.orderList.View.map(f=>f[1]).filter(id=>id.length>0);
       //get products from productlist based on order Ids 
       this.fetchData.filterProducts(this.search).subscribe(products => {      
       this.productList= products.filter(products => (idList.indexOf(products.id) != -1))
       .map((item)=> {item.count=this.orderList.View.filter(f=>f[0]==item.id)[0][1];  return item;});       
       this.isloading=false;
      }      
     );
    }

  }
}
