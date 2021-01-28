import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from "@angular/material/snack-bar";
import { BehaviorSubject, Observable } from "rxjs";
import { Subject } from "rxjs/internal/Subject";
import { AuthService } from "../Service/auth.service"; 
import { basketModel, orderModel, ProductViewModel,User } from "../model/appModel";
import { FetchdataService } from './fetchdata.service'

@Injectable({ providedIn: 'root' })
export class OrderService {

    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    basket: basketModel;//keep all items that added by user to bascket
    basket2=new BehaviorSubject<any>(null);//keep all items that added by user to bascket
    basketChanged = new Subject<any>();
    orders: Observable<any>;

    constructor(
        private authService:AuthService,
        private _snackBar: MatSnackBar, 
        private http: HttpClient,
        public fetchData: FetchdataService) {
        this.basket = new basketModel();
    }

    openSnackBar(title: string, isAdded:boolean=true) {        
        let message =  (isAdded)? " added to card!":"";
        this._snackBar.open(title + message, "ok", {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

 
    clearBasket() {
        this.basket.items = [];
        this.basketChanged.next(this.basket);  
        this.saveBasket();      
        this.openSnackBar("all item has been removed from basket!",false);
    }

    updateBasket(product: ProductViewModel) {
        
        let updateItem = this.basket.items.find(this.findIndexToUpdate, product.Id);
        let index = this.basket.items.indexOf(updateItem);
        this.basket.items[index].count = product.count;
        this.basketChanged.next(this.basket);
        this.saveBasket();
    }

    findIndexToUpdate(newItem) {
        return newItem.Id === this;
    }

    addToBasket(product: ProductViewModel) {
       
        if (this.basket.items != null && this.basket.items.filter(p => p.Id == product.Id).length) {
            //Update if item exist 
            let item = this.basket.items.filter(p => p.Id == product.Id)[0];
            product.count = (Number(Number(item.count) + 1)).toString();
            this.updateBasket(product);
        }
        else {
            //add if item exist not exist
            product.count = "1";
            this.basket.items.push(product);
            this.basketChanged.next(this.basket);
        }
        this.openSnackBar(product.Title);
        this.saveBasket();       
    }


    saveOrder(order:orderModel)
    {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email);         
        this.http.post('http://Orders/'+username,
        order
        ).subscribe(
            s => console.log(s)
        );
    }


    getOrders():Observable<any>
    {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email); 
        this.orders= this.fetchData.GetDataFromSever("Orders/"+username);
        return this.orders;
    }

    saveBasket()
    {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email);  
        this.http.delete('http://Baskets/'+username
        ).subscribe(
            ()=>
            {
                this.http.post('http://Baskets/'+username, this.basket
                ).subscribe(
                    s => console.log(s)
                );
            }
        );        
    }

    getBasket() 
    {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email); 
        this.fetchData.GetDataFromSever("Baskets/"+username).subscribe
        ((basket)=>{
            this.basket=basket[0];   
            this.basketChanged.next(this.basket);   
            console.log( this.basket) ;     
        });        
    }

}