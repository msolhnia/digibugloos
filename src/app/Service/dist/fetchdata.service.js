"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FetchdataService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var FetchdataService = /** @class */ (function () {
    function FetchdataService(http, authService) {
        this.http = http;
        this.authService = authService;
        this.allProducts = this.GetDataFromServer("Product"); //get all products from server       
        this.allCategory = this.GetDataFromServer("Category"); //get all Categories from server       
    }
    FetchdataService.prototype.refreshProduct = function () {
        this.allProducts = this.GetDataFromServer("Product");
    };
    FetchdataService.prototype.filterProducts = function (search) {
        return this.allProducts.pipe(operators_1.map(function (products) {
            return products.filter(function (d) { return (search.id == "" || d.id == search.id) && (search.category == -1 || d.category == search.category); });
        }));
    };
    FetchdataService.prototype.GetDataFromServer = function (table) {
        return this.http
            .get('http://' + table)
            .pipe(operators_1.catchError(this.authService.handleError), operators_1.map(function (responseData) {
            var postsArray = [];
            for (var key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    postsArray.push(__assign(__assign({}, responseData[key]), { id: key }));
                }
            }
            return postsArray;
        }));
    };
    FetchdataService = __decorate([
        core_1.Injectable()
    ], FetchdataService);
    return FetchdataService;
}());
exports.FetchdataService = FetchdataService;
