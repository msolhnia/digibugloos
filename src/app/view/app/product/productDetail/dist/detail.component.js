"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DetailComponent = void 0;
var core_1 = require("@angular/core");
var Search_1 = require("src/app/model/classes/Search");
var DetailComponent = /** @class */ (function () {
    function DetailComponent(route, router, fetchData, OrderServise, authService) {
        this.route = route;
        this.router = router;
        this.fetchData = fetchData;
        this.OrderServise = OrderServise;
        this.authService = authService;
        this.isloading = true;
        this.isAuthenticated = false;
        this.customOptions2 = {
            loop: false,
            autoplay: false,
            dots: false,
            nav: true,
            margin: 30,
            navText: ['<div class="navi nxt">><div/>', '<div class="navi prv"><>><div/>'],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 5
                },
                1000: {
                    items: 5
                }
            }
        };
        this.search = new Search_1.Search();
    }
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.paramsSubscription = this.route.params.subscribe(function (params) {
            var id = _this.route.snapshot.paramMap.get('id');
            _this.search.id = id.toString();
            _this.getProducts();
        });
        this.userSub = this.authService.user.subscribe(function (user) {
            _this.isAuthenticated = !!user;
        });
    };
    DetailComponent.prototype.ngOnDestroy = function () {
        this.paramsSubscription.unsubscribe();
        this.userSub.unsubscribe();
    };
    DetailComponent.prototype.onCatClick = function () {
        this.router.navigate(['/list', this.category.Id], { relativeTo: this.route });
    };
    DetailComponent.prototype.getProducts = function () {
        var _this = this;
        this.fetchData.filterProducts(this.search).subscribe(function (product) {
            _this.product = product[0];
            _this.getCategory();
            _this.getSliderProducts(_this.product.category);
        });
    };
    DetailComponent.prototype.getCategory = function () {
        var _this = this;
        this.fetchData.allCategory.subscribe(function (Categories) {
            _this.category = Categories.filter(function (category) { return category.Id == _this.product.category; })[0];
        });
    };
    DetailComponent.prototype.getSliderProducts = function (catId) {
        var _this = this;
        var sliderSearch = new Search_1.Search();
        sliderSearch.category = Number(catId);
        this.fetchData.filterProducts(sliderSearch).subscribe(function (products) {
            _this.sliderProduct = products;
        });
    };
    DetailComponent.prototype.goToProduct = function (id) {
        this.router.navigate(['/detail', id], { relativeTo: this.route });
    };
    DetailComponent.prototype.allproduct = function () {
        this.router.navigate(['/list', -1], { relativeTo: this.route });
    };
    DetailComponent.prototype.addtoCard = function (product) {
        this.OrderServise.addToBasket(product);
    };
    DetailComponent.prototype.ngAfterViewChecked = function () {
        this.isloading = false;
    };
    DetailComponent = __decorate([
        core_1.Component({
            selector: 'app-detail',
            templateUrl: './detail.component.html',
            styleUrls: ['./detail.component.css']
        })
    ], DetailComponent);
    return DetailComponent;
}());
exports.DetailComponent = DetailComponent;
