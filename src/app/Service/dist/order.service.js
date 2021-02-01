"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrderService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var Basket_1 = require("../model/classes/Basket");
var OrderService = /** @class */ (function () {
    function OrderService(authService, _snackBar, http, fetchData) {
        var _this = this;
        this.authService = authService;
        this._snackBar = _snackBar;
        this.http = http;
        this.fetchData = fetchData;
        this.horizontalPosition = 'right';
        this.verticalPosition = 'bottom';
        this.basketChanged = new rxjs_1.ReplaySubject();
        this.basket = new Basket_1.Basket();
        this.authService.isAuthenticated.subscribe(function (isAuthenticated) {
            if (isAuthenticated) {
                _this.getBasket();
            }
            else {
                _this.basket.items = [];
                _this.basketChanged.next(_this.basket);
            }
        });
    }
    OrderService.prototype.openSnackBar = function (title, isAdded) {
        if (isAdded === void 0) { isAdded = true; }
        var message = (isAdded) ? " added to card!" : "";
        this._snackBar.open(title + message, "ok", {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
        });
    };
    OrderService.prototype.clearBasket = function () {
        this.basket = new Basket_1.Basket();
        this.basketChanged.next(this.basket);
        this.saveBasket();
        this.openSnackBar("all item has been removed from basket!", false);
    };
    OrderService.prototype.updateBasket = function (product) {
        var updateItem = this.basket.items.find(this.findIndexToUpdate, product.Id);
        var index = this.basket.items.indexOf(updateItem);
        this.basket.items[index].count = product.count;
        this.basketChanged.next(this.basket);
        this.saveBasket();
    };
    OrderService.prototype.findIndexToUpdate = function (newItem) {
        return newItem.Id === this;
    };
    OrderService.prototype.addToBasket = function (product) {
        if (this.basket != null && this.basket.items != null && this.basket.items.filter(function (p) { return p.Id == product.Id; }).length) {
            //Update if item exist 
            var item = this.basket.items.filter(function (p) { return p.Id == product.Id; })[0];
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
    };
    OrderService.prototype.saveOrder = function (order) {
        var _this = this;
        var username = this.authService.correctUserName(this.authService.appUser.email);
        this.http.post('http://Orders/' + username, order).subscribe(function (s) { _this.getOrders(username); });
    };
    OrderService.prototype.getOrders = function (userName) {
        if (userName === void 0) { userName = ""; }
        if (!userName.length) {
            userName = this.authService.appUser.email;
        }
        userName = this.authService.correctUserName(this.authService.appUser.email);
        this.orders = this.fetchData.GetDataFromServer("Orders/" + userName);
        return this.orders;
    };
    OrderService.prototype.saveBasket = function () {
        var _this = this;
        var username = this.authService.correctUserName(this.authService.appUser.email);
        this.http["delete"]('http://Baskets/' + username).subscribe(function () {
            _this.http.post('http://Baskets/' + username, _this.basket).subscribe(function (s) { return console.log(s); });
        });
    };
    OrderService.prototype.getBasket = function () {
        var _this = this;
        var username = this.authService.correctUserName(this.authService.appUser.email);
        this.fetchData.GetDataFromServer("Baskets/" + username).subscribe(function (basket) {
            if (basket != null && basket != undefined && basket.length > 0) {
                _this.basket = basket[0];
                _this.basketChanged.next(_this.basket);
            }
        }, function (errorMessage) {
            _this.authService.logout();
        });
    };
    OrderService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], OrderService);
    return OrderService;
}());
exports.OrderService = OrderService;
