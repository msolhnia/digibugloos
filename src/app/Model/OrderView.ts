import { ProductView } from "../Interface/ProductView";
import { orderService } from "../service/order.service";
import { Order } from "./Order";
import { OrderStatus } from "./OrderStatus";

export class OrderView {
    price: string = "";
    products: string = "";
    description: string = "";
    status: string = "";
    View: string[][] = [];

    currencyPipe(price: string) {
        let numberFormat = new Intl.NumberFormat();
        return numberFormat.format(Number(price));
    }

    getStatusValue(status: OrderStatus) {
        let orderStatus = OrderStatus;
        return orderStatus[status];
    }

    //get title and count of product from product model
    getProductsInfo(orderitems: ProductView[]) {
        let productsInfo: string = "";
        orderitems.forEach(product => {
            productsInfo += product.title + "(" + product.count + "),";
        });
        return productsInfo;
    }


    //get ids of product from product model
    getProductsIds(orderitems: ProductView[]) {
        let productsIds: string[][] = [];
        orderitems.forEach(product => {
            let str: string[] = [];
            str.push(product.id);
            str.push(product.count);
            
            productsIds.push(str);
        });
        return productsIds;
    }

    //to show orders in table, we must customize model
    ordersToOrderViews(orders: Order[]) {
        let orderViews:OrderView[]= [];
        orders.forEach(order => {
            let orderView = new OrderView();
            orderView.price = this.currencyPipe(order.price);
            orderView.description = order.description;
            orderView.status = this.getStatusValue(order.status);
            orderView.products = this.getProductsInfo(order.items);
            orderView.View = this.getProductsIds(order.items);

            orderViews.push(orderView);
        });
        return orderViews;
    }
}

