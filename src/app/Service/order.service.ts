import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from "@angular/material/snack-bar";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { Basket } from "../model/classes/Basket";
import { Order } from "../model/classes/Order";
import { User } from "../model/classes/User";
import { ProductView } from "../model/interfaces/ProductView";
import { AuthService } from "../Service/auth.service";
import { FetchdataService } from './fetchdata.service'

@Injectable({ providedIn: 'root' })
export class OrderService {

    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    basket: Basket;//keep all items that added by user to bascket
    basketChanged = new BehaviorSubject<any>(null);
    orders: Order[] = [];
    orderChanged = new Subject<any>();
    constructor(
        private authService: AuthService,
        private _snackBar: MatSnackBar,
        private http: HttpClient,
        public fetchData: FetchdataService) {
        this.basket = new Basket();
         
        this.authService.isAuthenticated.subscribe(
            (isAuthenticated) => {
                if (isAuthenticated) {
                    this.getBasket();
                    this.getOrders();
                }
                else {
                    this.basket.items = [];
                    this.basketChanged.next(this.basket);
                }
            }
        )

    }

    openSnackBar(title: string, isAdded: boolean = true) {
        let message = (isAdded) ? " added to card!" : "";
        this._snackBar.open(title + message, "ok", {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }



    clearBasket() {
        this.basket = new Basket();
        this.basketChanged.next(this.basket);
        this.saveBasket();
        this.openSnackBar("all item has been removed from basket!", false);
    }

    updateBasket(product: ProductView) {

        let updateItem = this.basket.items.find(this.findIndexToUpdate, product.Id);
        let index = this.basket.items.indexOf(updateItem);
        this.basket.items[index].count = product.count;
        this.basketChanged.next(this.basket);
        this.saveBasket();
    }

    findIndexToUpdate(newItem) {
        return newItem.Id === this;
    }

    addToBasket(product: ProductView) {
        if (this.basket != null && this.basket.items != null && this.basket.items.filter(p => p.Id == product.Id).length) {
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
        this.openSnackBar(product.title);
        this.saveBasket();
    }


    saveOrder(order: Order) {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email);
        this.http.post('http://Orders/' + username,
            order
        ).subscribe(
            (orders) => {
                console.log("save order----->");
                this.orders.push(order);
                console.log(this.orders);
                this.getOrders();  
            }
        );
    }


    getOrders() {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email);
        this.fetchData.GetDataFromServer("Orders/" + username)
            .subscribe
            (
                (orders) => {
                    if (orders != null && orders != undefined && orders.length > 0) {
                        this.orders = orders;
                        this.orderChanged.next(orders);
                        console.log(orders);
                    }
                }
                ,
                errorMessage => {
                    this.authService.logout();
                }
            );
    }

    saveBasket() {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email);
        this.http.delete('http://Baskets/' + username
        ).subscribe(
            () => {
                this.http.post('http://Baskets/' + username, this.basket
                ).subscribe(
                    s => console.log(s)
                );
            }
        );
    }

    getBasket() {
        let username = this.authService.correctUserName((<User>this.authService.appUser).email);
        this.fetchData.GetDataFromServer("Baskets/" + username).subscribe
            ((basket) => {
                if (basket != null && basket != undefined && basket.length > 0) {
                    this.basket = basket[0];
                    this.basketChanged.next(this.basket);
                }
            }
                ,
                errorMessage => {
                    this.authService.logout();
                }
            );
    }

}