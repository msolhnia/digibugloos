import { ProductView } from "../interfaces/ProductView";
import { OrderStatus } from "./OrderStatus";

export class Order { 
    id:string="";
    price: string="";       
    items:ProductView[]=[];
    description: string="";
    status:OrderStatus=OrderStatus.received;//we set received by default at initial
}
