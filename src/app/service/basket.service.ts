import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { ProductView } from "../Interface/ProductView";
import { Basket } from "../Model/Basket";
import { alertService } from "./alert.service";
import { authService } from "./auth.service";
import { fetchDataService } from "./fetchData.service";

@Injectable({ providedIn: 'root' })
export class basketService
{
    basket: Basket;//keep all items that added by user to bascket
    basketChanged = new BehaviorSubject<any>(null);

    constructor(private authService: authService,       
        private http: HttpClient,
        private alertService: alertService,
        public fetchData: fetchDataService)
    {
        this.basket = new Basket();

        this.authService.isAuthenticated.subscribe(
            (isAuthenticated) => {
                if (isAuthenticated) {
                    this.getBasket();
                }
                else {
                    this.basket.items = [];
                    this.basketChanged.next(this.basket);
                }
            }
        )
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
        this.alertService.openSnackBar(product.title);
        this.saveBasket();
    }
    

    saveBasket() {
        this.authService.profile.subscribe(
            profile => {
                let username = this.authService.correctUserName(profile[0].originalName);
                this.http.delete('http://Baskets/' + username
                ).subscribe( () => {this.http.post('http://Baskets/' + username, this.basket).subscribe(); }
                );
            })
    }

    getBasket() {
        this.authService.profile.subscribe(
            profile => {
                if(profile && profile[0])
                {
                    let username = this.authService.correctUserName(profile[0].originalName);
                    this.fetchData.getDataFromServer("Baskets/" + username).subscribe
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
            })
    }

    clearBasket() {
        this.basket = new Basket();
        this.basketChanged.next(this.basket);
        this.saveBasket();
        this.alertService.openSnackBar("all item has been removed from basket!", false);
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
}