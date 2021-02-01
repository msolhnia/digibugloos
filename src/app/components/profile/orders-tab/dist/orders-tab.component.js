"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrdersTabComponent = void 0;
var core_1 = require("@angular/core");
var table_1 = require("@angular/material/table");
var dialog_component_1 = require("src/app/components/dialog/dialog.component");
var OrderView_1 = require("src/app/model/classes/OrderView");
var OrderStatus_1 = require("src/app/model/classes/OrderStatus");
var OrdersTabComponent = /** @class */ (function () {
    function OrdersTabComponent(orderService, dialog, authService) {
        this.orderService = orderService;
        this.dialog = dialog;
        this.authService = authService;
        this.columns = [];
        this.displayedColumns = this.columns.map(function (c) { return c.columnDef; });
        this.orders = [];
        this.orderViews = [];
        this.DynamicColumns();
    }
    OrdersTabComponent.prototype.getOrder = function () {
        var _this = this;
        this.authService.user.subscribe(function (user) {
            if (user) {
                _this.orderService.getOrders(user.email).subscribe(function (orders) {
                    _this.orders = orders;
                    var st = OrderStatus_1.OrderStatus;
                    var nf = new Intl.NumberFormat();
                    _this.orders.forEach(function (order) {
                        var orderView = new OrderView_1.OrderView();
                        orderView.price = nf.format(Number(order.price));
                        orderView.description = order.description;
                        orderView.status = st[order.status];
                        var itemList = "";
                        var itemIdList = [];
                        order.items.forEach(function (product) {
                            itemList += product.title + "(" + product.count + "),";
                        });
                        orderView.products = itemList;
                        order.items.forEach(function (product) {
                            var str = [];
                            str.push(product.id);
                            str.push(product.count);
                            itemIdList.push(str);
                        });
                        orderView.View = itemIdList;
                        _this.orderViews.push(orderView);
                    });
                    _this.DynamicColumns();
                    _this.dataSource = new table_1.MatTableDataSource(_this.orderViews);
                    _this.dataSource.paginator = _this.paginator;
                    _this.paginator.pageSize = 10;
                });
            }
        });
    };
    OrdersTabComponent.prototype.ngAfterViewInit = function () {
        this.getOrder();
    };
    OrdersTabComponent.prototype.DynamicColumns = function () {
        var el = new OrderView_1.OrderView();
        var data_array = [];
        var keys = Object.keys(el);
        Object.keys(el).map(function (key, index) {
            var my_object = {};
            my_object.columnDef = key;
            my_object.header = key == "price" ? "Total Price" : key;
            my_object.cell = function (element) { return eval("element." + key); };
            data_array.push(my_object);
        });
        this.columns = data_array;
        this.displayedColumns = this.columns.map(function (c) { return c.columnDef; });
    };
    OrdersTabComponent.prototype.viewDetail = function (data) {
        var dialogRef = this.dialog.open(dialog_component_1.DialogComponent, {
            data: {
                list: data
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            // console.log(result);
        });
    };
    __decorate([
        core_1.ViewChild('MatPaginator')
    ], OrdersTabComponent.prototype, "paginator");
    OrdersTabComponent = __decorate([
        core_1.Component({
            selector: 'app-orders-tab',
            templateUrl: './orders-tab.component.html',
            styleUrls: ['./orders-tab.component.css']
        })
    ], OrdersTabComponent);
    return OrdersTabComponent;
}());
exports.OrdersTabComponent = OrdersTabComponent;
