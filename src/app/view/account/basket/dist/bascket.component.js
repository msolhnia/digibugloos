"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BascketComponent = void 0;
var core_1 = require("@angular/core");
var BascketComponent = /** @class */ (function () {
    function BascketComponent(basketService, router, route) {
        var _this = this;
        this.basketService = basketService;
        this.router = router;
        this.route = route;
        this.basketService.basketChanged.subscribe(function (basket) {
            _this.basket = basket;
        });
    }
    BascketComponent.prototype.onClearBasket = function () {
        this.basketService.clearBasket();
    };
    BascketComponent.prototype.onOpenOrder = function () {
        this.router.navigate(['/confirmorder'], { relativeTo: this.route });
    };
    BascketComponent = __decorate([
        core_1.Component({
            selector: 'app-bascket',
            templateUrl: './bascket.component.html',
            styleUrls: ['./bascket.component.css']
        })
    ], BascketComponent);
    return BascketComponent;
}());
exports.BascketComponent = BascketComponent;
