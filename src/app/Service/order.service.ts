import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Order } from "../Model/Order";
import { authService } from "./auth.service";
import { fetchDataService } from './fetchData.service'

@Injectable({ providedIn: 'root' })
export class orderService {
    orders: Order[] = [];
    orderChanged = new Subject<any>();
    constructor(
        private authService: authService,
        private http: HttpClient,
        public fetchData: fetchDataService) {

        this.authService.isAuthenticated.subscribe(
            (isAuthenticated) => {
                if (isAuthenticated) {
                    this.getOrders();
                }
            }
        )
    }

    saveOrder(order: Order) {        
        this.authService.profile.subscribe(
            profile => {
                let username = this.authService.correctUserName(profile.originalName);
                this.http.post('http://Orders/' + username,
                    order
                ).subscribe(
                    (orders) => {
                        this.orders.push(order);
                        this.getOrders();
                    }
                );
            }
        )


    }
    getOrders() {

        this.authService.profile.subscribe(
            profile => {
                let username = this.authService.correctUserName(profile[0].originalName);
             
                this.fetchData.getDataFromServer("Orders/" + username)
                .subscribe
                (
                    (orders) => {
                        if (orders != null && orders != undefined && orders.length > 0) {
                            this.orders = orders;
                            this.orderChanged.next(orders);
                        }
                    }
                    ,
                    errorMessage => {
                        this.authService.logout();
                    }
                );
            })
    }
}