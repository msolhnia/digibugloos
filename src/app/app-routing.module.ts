import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./auth/auth.component";
import { DetailComponent } from './components/detail/detail.component';
import { ListComponent } from './components/list/list.component';
import { MainComponent } from './components/main/main.component';
import { OrderComponent } from "./components/order/order.component";

const appRoutes:Routes=[
    {path:'', component:MainComponent},
    {path:'detail/:id', component:DetailComponent},        
    { path: 'list', component: ListComponent,children: 
      [         
        { path: ':id', component: ListComponent }     
      ] 
    },
    {path:'confirmorder', component:OrderComponent},
    { path: 'auth', component: AuthComponent }
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

