"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrderComponent = void 0;
var core_1 = require("@angular/core");
var Basket_1 = require("src/app/model/classes/Basket");
var Order_1 = require("src/app/model/classes/Order");
var OrderStatus_1 = require("src/app/model/classes/OrderStatus");
var OrderComponent = /** @class */ (function () {
    function OrderComponent(orderService, route, router) {
        this.orderService = orderService;
        this.route = route;
        this.router = router;
        this.totalprice = 0;
        this.basket = new Basket_1.Basket();
        this.order = new Order_1.Order();
        this.basket = this.orderService.basket;
        this.totalprice = this.getTotalCost(this.basket.items);
    }
    OrderComponent.prototype.getTotalCost = function (basketItems) {
        return basketItems.reduce(function (result, item) { return item.count * item.price + result; }, 0);
    };
    OrderComponent.prototype.ngOnInit = function () {
    };
    OrderComponent.prototype.onCountChanged = function (value) {
        this.totalprice = this.getTotalCost(this.basket.items);
    };
    OrderComponent.prototype.saveOrder = function () {
        //clear nuused data, we dont need to save body(description) of a product in basket 
        this.order.items = this.basket.items.map(function (item) { item.body = ""; return item; });
        this.order.price = this.getTotalCost(this.basket.items);
        this.order.status = OrderStatus_1.OrderStatus.received;
        this.orderService.saveOrder(this.order);
        this.orderService.clearBasket();
        this.router.navigate(['/profile'], { relativeTo: this.route });
    };
    OrderComponent = __decorate([
        core_1.Component({
            selector: 'app-order',
            templateUrl: './order.component.html',
            styleUrls: ['./order.component.css']
        })
    ], OrderComponent);
    return OrderComponent;
}());
exports.OrderComponent = OrderComponent;
