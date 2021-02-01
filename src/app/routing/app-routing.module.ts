import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "../view/app/firstPage/app.component";
import { AuthComponent } from "../view/account/register/auth.component";
import { ListComponent } from '../view/app/product/productList/list.component';
import { MainComponent } from '../view/app/firstPage/main/main.component';
import { OrderComponent } from "../view/account/order/order.component";
import { ProfileComponent } from "../view/account/profile/profile.component";
import { DetailComponent } from "../view/app/product/productDetail/detail.component";

const appRoutes:Routes=[
    {path:'', component:MainComponent},
    {path:'detail/:id', component:DetailComponent},        
    { path: 'list', component: ListComponent,children: 
      [         
        { path: ':id', component: ListComponent }     
      ] 
    },
    {path:'confirmorder', component:OrderComponent},
    { path: 'auth', component: AuthComponent },
    { path: 'profile', component: ProfileComponent }
  ];
  


  @NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports:[RouterModule]    
  })
 
export class AppRoutingModule
{

}

