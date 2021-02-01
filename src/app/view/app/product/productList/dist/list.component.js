"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ListComponent = void 0;
var core_1 = require("@angular/core");
var Search_1 = require("src/app/Model/Search");
var ListComponent = /** @class */ (function () {
    function ListComponent(fetchData, route, basketService, router, authService) {
        var _this = this;
        this.fetchData = fetchData;
        this.route = route;
        this.basketService = basketService;
        this.router = router;
        this.authService = authService;
        this.isAuthenticated = false;
        this.config = {
            currentPage: 1,
            itemsPerPage: 10
        };
        this.search = new Search_1.Search();
        if (route.firstChild) {
            this.paramsSubscription = route.firstChild.params.subscribe(function (params) {
                var id = +params['id'];
                if (id) {
                    _this.search.category = Number(id);
                    _this.getProducts();
                }
            });
        }
        else {
            this.getProducts();
        }
        this.getCategory();
    }
    ListComponent.prototype.onProductClick = function (id) {
        this.router.navigate(['/detail', id], { relativeTo: this.route });
    };
    ListComponent.prototype.pageChange = function (newPage) {
        this.config = {
            currentPage: newPage,
            itemsPerPage: 10
        };
    };
    ListComponent.prototype.sortFilter = function (id) {
        this.search.sortBy = id;
        this.getProducts();
    };
    ListComponent.prototype.selectCategory = function (id) {
        this.search.category = id;
        this.getProducts();
    };
    ListComponent.prototype.getProducts = function () {
        var _this = this;
        this.fetchData.filterProducts(this.search).subscribe(function (products) {
            _this.productList = products;
            switch (Number(_this.search.sortBy)) {
                case 1:
                    _this.productList = _this.productList.sort(function (a, b) {
                        return Number(new Date(b.Createdate)) - Number(new Date(a.Createdate));
                    });
                    break;
                case 2:
                    _this.productList = _this.productList.sort(function (a, b) {
                        return Number(a.price) - Number(b.price);
                    });
                    break;
                case 3:
                    _this.productList = _this.productList.sort(function (a, b) {
                        return Number(b.price) - Number(a.price);
                    });
                    break;
            }
        });
    };
    ListComponent.prototype.getCategory = function () {
        var _this = this;
        this.fetchData.allCategory.subscribe(function (Categories) {
            _this.cetegoryList = Categories;
        });
    };
    ListComponent.prototype.ngOnDestroy = function () {
        if (this.paramsSubscription && !this.paramsSubscription.closed) {
            this.paramsSubscription.unsubscribe();
        }
        this.userSub.unsubscribe();
    };
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userSub = this.authService.user.subscribe(function (user) {
            _this.isAuthenticated = !!user;
        });
    };
    ListComponent.prototype.addtoCard = function (product, id) {
        product.Id = id;
        this.basketService.addToBasket(product);
    };
    ListComponent = __decorate([
        core_1.Component({
            selector: 'app-list',
            templateUrl: './list.component.html',
            styleUrls: ['./list.component.css']
        })
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
